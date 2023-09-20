from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
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
        img = get_PIL_image(ds)
        img.save(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/images/{file}.png'))
        return get_PIL_image(ds)

    def post(self, request):
        directory = request.data.getlist('file')
        identifier = ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(10))
        dataset = Dataset(identifier=identifier)
        dataset.save()

        files = []
        for f in directory:
            if '.dcm' in f.name:
                files.append(f.name)
                file = File(dataset=dataset, file=f, scan=f'{f.name[:-4]}.png')
                file.save()
        
        file_objects = File.objects.filter(dataset=dataset)
        serializer = FileSerializer(file_objects, many=True)

        # os.rmdir(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{file}'))
        
        return Response(serializer.data)

