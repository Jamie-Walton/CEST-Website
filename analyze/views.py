import numpy as np
from matplotlib.path import Path
import matplotlib.pyplot as plt
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework import status
from backend.settings import MEDIA_ROOT
from .serializers import FileSerializer

from pydicom import dcmread
from analyze.pydicom_PIL import get_PIL_image

import secrets, string
import os

from analyze.models import Dataset, File


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
        
        return JsonResponse({'images': images})


@api_view(('POST',))
def report(request):

    def pointsToMask(poly_verts_list):
        '''Convert a list of polygon vertices to a list of masks'''
        
        nx, ny = 500, 500
        x, y = np.meshgrid(np.arange(nx), np.arange(ny))
        x, y = x.flatten(), y.flatten()
        points = np.vstack((x, y)).T
        grid = np.zeros(nx * ny, dtype=bool)

        if len(poly_verts_list[0]) == 2:
            poly_verts_list = [[point[1]] for point in poly_verts_list]

        for poly_verts in poly_verts_list:
        
            path = Path(poly_verts)
            # Check if points are inside the polygon
            poly_mask = path.contains_points(points)
            grid = np.logical_or(grid, poly_mask)

        grid = grid.reshape((ny, nx))
        return grid
    
    
    if request.method == 'POST':
        identifier = request.data["id"]

        epi_rois = request.data["epiROIs"]
        epi_points = [roi["points"] for roi in epi_rois]

        endo_rois = request.data["endoROIs"]
        endo_points = [roi["points"] for roi in endo_rois]

        insertion_rois = request.data["insertions"]
        insertion_points = [roi["points"] for roi in insertion_rois]
<<<<<<< HEAD
=======
        print(insertion_points)
>>>>>>> 583cb66b61dd25b812f8e4166f93dfbff87f5a51

        pixel_wise = request.data["pixelWise"]
        
        masks = {
            "epi": pointsToMask(epi_points), 
            "endo": pointsToMask(endo_points), 
            "insertions": pointsToMask(insertion_points)
        }
<<<<<<< HEAD
=======

        #plt.imshow(masks['epi'], cmap='Blues', origin='upper')
        #plt.show()
>>>>>>> 583cb66b61dd25b812f8e4166f93dfbff87f5a51

        return JsonResponse({})
