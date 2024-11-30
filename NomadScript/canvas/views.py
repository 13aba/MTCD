from django.shortcuts import render

# Create your views here.
import base64
from django.http import JsonResponse
from .models import *
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def save_drawing(request):
    """Save the user's drawing and provide the next reference image."""
    if request.method == 'POST':
        drawing_data = request.POST.get('drawing')
        label = request.POST.get('label')

        if not drawing_data or not label:
            return JsonResponse({'error': 'Missing data'}, status=400)

        # Decode and save the drawing
        format, imgstr = drawing_data.split(';base64,')
        ext = format.split('/')[-1]
        drawing_file = ContentFile(base64.b64decode(imgstr), name=f"{label}.{ext}")
        drawing = Drawing(label=label, image=drawing_file)
        drawing.save()

        # Get the next reference image sequentially
        next_reference = get_next_reference(current_label=label)

        if next_reference:
            return JsonResponse({
                'message': 'Drawing saved!',
                'next_reference': {
                    'label': next_reference.label,
                    'image': next_reference.image.url
                }
            })
        else:
            return JsonResponse({
                'message': 'No more reference. Thank you for contributing!',
                'next_reference': None  # Indicate no more references
            })
    return JsonResponse({'error': 'Invalid request'}, status=400)

def draw_page(request):
    reference = get_next_reference()
    context = {
        'reference': reference
    }
    return render(request, 'test.html', context)

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