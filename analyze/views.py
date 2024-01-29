from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from backend.settings import MEDIA_ROOT

import numpy as np
from pydicom import dcmread
from analyze.pydicom_PIL import get_PIL_image
from PIL import Image
import secrets, string
import os
import matplotlib.pyplot as plt
import matplotlib

from analyze.models import Dataset, File
from analyze.extract_data import load_data, pointsToMask
from analyze.analyze_data import generate_zspec, b0_correction


class UploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def load_image(self, file, identifier):
        ds = dcmread(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{file}'))
        return get_PIL_image(ds)

    def post(self, request):
        directory = request.data.getlist('file')
        identifier = ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(10))
        dataset = Dataset(identifier=identifier)
        dataset.save()

        images = []
        os.mkdir(f'{MEDIA_ROOT}/uploads/{identifier}')
        os.mkdir(f'{MEDIA_ROOT}/uploads/{identifier}/images')
        for f in directory:
            if '.dcm' in f.name:
                images += [{'id': identifier, 'image': f.name[:-4]}]
                file = File(dataset=dataset, file=f)
                file.save()
                img = self.load_image(f.name, identifier)
                img.save(f'{MEDIA_ROOT}/uploads/{identifier}/images/{f.name[:-4]}.png')

        first = os.listdir(f'{MEDIA_ROOT}/uploads/{identifier}/images')[0]
        img = Image.open(f'{MEDIA_ROOT}/uploads/{identifier}/images/{first}')
        [width, height] = img.size
        dataset.image_width = width
        dataset.image_height = height
        dataset.save()
        
        return JsonResponse({'images': images, 'width': width, 'height': height})


@api_view(('POST',))
def report(request):
    
    if request.method == 'POST':

        # Retrieve dataset
        identifier = request.data["id"]
        ds = Dataset.objects.get(identifier=identifier)
        width, height = ds.image_width, ds.image_height
        data, freq_offsets = load_data(identifier)
        freq_offsets.sort()
        reference_frequency = 1000

        # Unpack data from frontend
        epi_points = [[roi["points"]] for roi in request.data["epiROIs"]]
        endo_points = [[roi["points"]] for roi in request.data["endoROIs"]]
        epis = [pointsToMask(p, width, height).astype(int) for p in epi_points]
        endos = [pointsToMask(p, width, height).astype(int) for p in endo_points]

        arvs = [[coord * 0.25 for coord in roi["points"][1]] for roi in request.data["arvs"]]
        irvs = [[coord * 0.25 for coord in roi["points"][1]] for roi in request.data["irvs"]]
        pixel_wise = request.data["pixelWise"] # TODO: Deal with pixel wise (currently only segment-wise)
        
        # Create myocardium mask
        masks = [np.subtract(epi, endo) for epi, endo in zip(epis, endos)]

        # Sort images by frequency
        data = [d for (d, f) in sorted(zip(data, freq_offsets), key=lambda tup : tup[1])]

        # Generate z-spectra
        zspec, signal_mean, signal_std, signal_n, signal_intensities, indices = \
            generate_zspec(data, masks, arvs, irvs)
        
        # B0 Correction
        corrected_offsets, b0_shift = b0_correction(freq_offsets[1:], zspec)
        print(corrected_offsets[0])

        matplotlib.use('SVG')
        fig, ax = plt.subplots()
        ax.plot(corrected_offsets[0], zspec[0], linewidth=2.0)
        plt.savefig('zspec.png')

        # TODO: Lorentzian Fitting
        # TODO: Package Results

        return JsonResponse({})
