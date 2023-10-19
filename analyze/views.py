from marshal import load
import re
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

    def pointsToMask(points):
        '''
        Example points data structure:
        [
            [
                [207.40625, 229.203125], 
                [272.40625, 165.203125], 
                [345.40625, 238.203125], 
                [276.40625, 302.203125], 
                [198.40625, 283.203125]
            ],
            [
                [207.40625, 229.203125], 
                [272.40625, 165.203125], 
                [345.40625, 238.203125], 
                [276.40625, 302.203125], 
                [198.40625, 283.203125]
            ],
            [
                [207.40625, 229.203125], 
                [272.40625, 165.203125], 
                [345.40625, 238.203125], 
                [276.40625, 302.203125], 
                [198.40625, 283.203125]
            ]
        ]
        '''
        #TODO: Fill in function
    
    if request.method == 'POST':
        identifier = request.data["id"]

        epi_rois = request.data["epiROIs"]
        epi_points = [roi["points"] for roi in epi_rois]

        endo_rois = request.data["endoROIs"]
        endo_points = [roi["points"] for roi in endo_rois]

        insertion_rois = request.data["insertions"]
        insertion_points = [roi["points"] for roi in insertion_rois]

        pixel_wise = request.data["pixelWise"]
        
        masks = {
            "epi": pointsToMask(epi_points), 
            "endo": pointsToMask(endo_points), 
            "insertions": pointsToMask(insertion_points)
        }

        return JsonResponse({})
