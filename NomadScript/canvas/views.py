from django.shortcuts import render

# Create your views here.
import base64
from django.http import JsonResponse
from .models import Drawing
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def save_drawing(request):
    if request.method == 'POST':
        data_url = request.POST.get('drawing')  # Base64 data
        label = request.POST.get('label')

        if not data_url or not label:
            return JsonResponse({'status': 'error', 'message': 'Missing drawing or label'})

        # Decode the Base64 image data
        format, imgstr = data_url.split(';base64,')  # Split off the header part of the data URL
        ext = format.split('/')[-1]  # Extract the image file extension (e.g., 'png')
        
        # Generate the filename using the label and extension
        file_name = f"{label}.{ext}"
        
        # Decode the Base64 string into binary data
        image_data = ContentFile(base64.b64decode(imgstr), name=file_name)
        
        # Save the image to the model
        drawing = Drawing(label=label, image=image_data)
        drawing.save()

        print(f"Image saved to: {drawing.image.path}")  # Debugging: print the saved image path

        return JsonResponse({'status': 'success', 'file_path': drawing.image.url})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def draw_page(request):
    return render(request, 'test.html')