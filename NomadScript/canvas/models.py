
# Create your models here.

from django.db import models
import os

#Function that creates new folder in the media file using the character label 
def upload_to_character(instance, filename):
    # Use the label (character class) as the directory name
    character_class = instance.label
    return os.path.join(character_class, filename)

#Table that will hold the user drawings. Columns are image(data from) and label(which charactar it is), it
#does not have user id column since we dont need data for training ML model.
class Drawing(models.Model):
    image = models.ImageField(upload_to=upload_to_character)
    label = models.CharField(max_length=255)

    def __str__(self):
        return self.label

#Table that will hold reference pictures for the tradional Mongolian characters.  
class Reference(models.Model):
    label = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='Letters/') 

    def __str__(self):
        return self.label