import numpy as np
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http.response import JsonResponse
from backend.settings import MEDIA_ROOT
from .tools.berkeley.resources.cest_analysis import zspec_voxel, zspec_avg, plt_avg

from pydicom import dcmread
from analyze.pydicom_PIL import get_PIL_image
from PIL import Image

import secrets, string
import os

from analyze.models import Dataset, File
from analyze.extract_data import load_data, pointsToMask
from analyze.analyze_data import create_spectrum_roi
from analyze.tools.berkeley.resources.b0_correction import b0_correction, interpolate_wassr, wassr_b0_map


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
        
        return JsonResponse({'images': images})


@api_view(('POST',))
def report(request):

    
    if request.method == 'POST':

        identifier = request.data["id"]
        ds = Dataset.objects.get(identifier=identifier)
        width, height = ds.image_width, ds.image_height
        data, cest_offsets = load_data(identifier)

        epi_rois = request.data["epiROIs"]
        epi_points = [[roi["points"]] for roi in epi_rois]

        endo_rois = request.data["endoROIs"]
        endo_points = [[roi["points"]] for roi in endo_rois]

        arv_rois = request.data["arvs"]
        arv_points = [[roi["points"]] for roi in arv_rois]

        irv_rois = request.data["irvs"]
        irv_points = [[roi["points"]] for roi in irv_rois]

        pixel_wise = request.data["pixelWise"]
        
        masks = {
            "epi": [pointsToMask(p, width, height) for p in epi_points], 
            "endo": [pointsToMask(p, width, height) for p in endo_points], 
            "arvs": [pointsToMask(p, width, height) for p in arv_points],
            "irvs": [pointsToMask(p, width, height) for p in irv_points]
        }

        wassr_offsets_interp, wassr_zspecs_interp = interpolate_wassr(wassr_offsets, wassr_zspecs)
        b0_map = wassr_b0_map(wassr_offsets_interp, wassr_zspecs_interp)
        cest_zspecs = b0_correction(cest_offsets, data, b0_map)
        cest_roi, map_mask = create_spectrum_roi(data, cest_zspecs)

        return JsonResponse({})
