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
        # TODO: Add in function
        print(points)
    
    if request.method == 'POST':
        identifier = request.data["id"]
        rois = request.data["rois"]
        points = [roi["points"] for roi in rois]
        pixel_wise = request.data["pixelWise"]
        
        masks = pointsToMask(points)

        return JsonResponse({})
