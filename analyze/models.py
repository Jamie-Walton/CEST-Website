from django.db import models

class Dataset(models.Model):

    identifier = models.CharField(max_length=20)
    

    def __str__(self):
        return f'Dataset<{self.identifier}>'
