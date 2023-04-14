from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from backend.settings import MEDIA_ROOT

from pydicom import dcmread
from pydicom.data import get_testdata_file
from dicom_parser import Image

import secrets, string
import os

from analyze.models import Dataset, File


class UploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def load_image(self, file, identifier):
        ds = dcmread(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{file}'))
        return ds.PixelData

    def post(self, request):
        directory = request.data.getlist('file')
        identifier = ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(10))
        dataset = Dataset(identifier=identifier)
        dataset.save()

        files = []
        for f in directory:
            file = File(dataset=dataset, file=f)
            file.save()
            if f.name != '.DS_Store':
                files.append(f.name)

        #path = os.path.join(MEDIA_ROOT, f'uploads/{id}/')
        #image = Image(os.path.join(MEDIA_ROOT, f'uploads/{identifier}/{files[0]}'))

        # delete files if saved
        
        return Response(status=status.HTTP_201_CREATED)

