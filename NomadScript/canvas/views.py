from django.shortcuts import render
import os 
import io
# Create your views here.
import base64
import tensorflow as tf
import numpy as np
from django.http import JsonResponse
from .models import *
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from PIL import Image


#Load machine learning model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'improved_model.h5')
MODEL = tf.keras.models.load_model(MODEL_PATH)

#Function that takes POST request from front-end and pass the data into back-end
@csrf_exempt
def save_drawing(request):
    
    if request.method == 'POST':
        drawing_data = request.POST.get('drawing')
        label = request.POST.get('label')
        #Return missing data response if there is no data in post request
        if not drawing_data or not label:
            return JsonResponse({'error': 'Missing data'}, status=400)

        # Decode and save the drawing
        # Convert the string base64 data into image file using ContentFile
        format, imgstr = drawing_data.split(';base64,')
        ext = format.split('/')[-1]
        drawing_file = ContentFile(base64.b64decode(imgstr), name=f"{label}.{ext}")
        # Create new data in Drawing table in the backend
        drawing = Drawing(label=label, image=drawing_file)
        drawing.save()

        # Get the next reference image sequentially using get_next_reference function
        next_reference = get_next_reference(current_label=label)

        # If there is next reference send message and return the API call with next references data
        if next_reference:
            return JsonResponse({
                'message': 'Drawing saved!',
                'next_reference': {
                    'label': next_reference.label,
                    'image': next_reference.image.url
                }
            })
        # If the drawing for last reference, alert the user
        else:
            return JsonResponse({
                'message': 'No more reference. Thank you for contributing!',
                'next_reference': None  
            })
    #Return error meassge if this function failed
    return JsonResponse({'error': 'Invalid request'}, status=400)

#Function that takes POST request from front-end Learn page and return if drawn image is correct
@csrf_exempt
def predict_drawing(request):
    
    if request.method == 'POST':
        drawing_data = request.POST.get('drawing')
        label = request.POST.get('label')
        #Return missing data response if there is no data in post request
        if not drawing_data or not label:
            return JsonResponse({'error': 'Missing data'}, status=400)

        # Decode and save the drawing
        processed_image = preprocess_base64_image(drawing_data)

        #Predict the image
        predictions = MODEL.predict(processed_image)
        predicted_index = np.argmax(predictions[0]) 
        predicted_index = int(predicted_index)
        print(predicted_index)
        #Return most likely letters index
        return JsonResponse({'prediction_index': predicted_index })
    
    #Return error meassge if this function failed
    return JsonResponse({'error': 'Invalid request'}, status=400)


#Function that renders canvas page
def home_page(request):
    return render(request, 'home.html')

#Function that renders canvas page
def learn_page(request):
    return render(request, 'learn.html')

#Function that renders canvas page
def contribute_page(request):
    #Only used once when this page is requested to display the first reference image
    reference = get_next_reference()
    context = {
        'reference': reference
    }
    return render(request, 'contribute.html', context)

#Function that renders canvas page
def about_page(request):
    return render(request, 'about.html')


#Function that takes a label of the current reference and return next references data in the database
def get_next_reference(current_label=None):
    """Get the next reference in sequence."""
    if current_label:
        # Find the next reference based on label order
        current_ref = Reference.objects.filter(label=current_label).first()
        if current_ref:
            next_ref = Reference.objects.filter(id__gt=current_ref.id).order_by('id').first()
            if next_ref:
                return next_ref
            else:
                return None
    # If no current_label or no next reference, return the first in sequence
    return Reference.objects.order_by('id').first()


def preprocess_base64_image(base64_str):

    if ',' in base64_str:
        base64_str = base64_str.split(',')[1]
    
    image_data = base64.b64decode(base64_str)
    
    image = Image.open(io.BytesIO(image_data)).convert('L')  # Grayscale

    # Resize to 300x300
    image = image.resize((300, 300))

    # Convert to NumPy array and normalize
    img_array = np.array(image).astype('float32') / 255.0

    # Add batch and channel dimensions: (1, 300, 300, 1)
    img_array = np.expand_dims(img_array, axis=(0, -1))

    return img_array