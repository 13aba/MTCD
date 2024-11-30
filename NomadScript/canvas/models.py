
# Create your models here.

from django.db import models
import os

def upload_to_character(instance, filename):
    # Use the label (character class) as the directory name
    character_class = instance.label
    return os.path.join(character_class, filename)

class Drawing(models.Model):
    image = models.ImageField(upload_to=upload_to_character)
    label = models.CharField(max_length=255)

    def __str__(self):
        return self.label
    
class Reference(models.Model):
    label = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='Letters/') 

    def __str__(self):
        return self.label