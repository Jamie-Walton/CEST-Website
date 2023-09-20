from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework import status
from backend.settings import MEDIA_ROOT

from pydicom import dcmread

import secrets, string
import os
import numpy as np

from analyze.models import Dataset, File


class UploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def load_image(self, file, identifier):
        ds = dcmread(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{file}'))
        return ds.pixel_array

    def post(self, request):
        directory = request.data.getlist('file')
        identifier = ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(10))
        dataset = Dataset(identifier=identifier)
        dataset.save()

        files = []
        images = []
        for f in directory:
            file = File(dataset=dataset, file=f)
            file.save()
            if f.name != '.DS_Store':
                files.append(f.name)
                images.append(self.load_image(f.name, identifier).tolist())
        
        return JsonResponse({'images': images})

