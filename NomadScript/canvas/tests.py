from django.test import TestCase
from django.urls import reverse
from .models import Drawing, Reference
import base64
from io import BytesIO
from django.core.files.images import ImageFile
# Create your tests here.


class DrawingModelTest(TestCase):
    
    def test_drawing_str_method(self):
        drawing = Drawing.objects.create(label='CharacterA', image=None)
        self.assertEqual(str(drawing), 'CharacterA')


class ReferenceModelTest(TestCase):

    def test_reference_str_method(self):
        reference = Reference.objects.create(label='CharacterA', image=None)
        self.assertEqual(str(reference), 'CharacterA')


class SaveDrawingViewTest(TestCase):
    
    def setUp(self):

        img = ImageFile(BytesIO(b"fake_image_data"), name='test_image.png')
        img.size = (100, 100)  

        # Create a reference object to be used in the test
        Reference.objects.create(label='CharacterA', image=img)
        Reference.objects.create(label='CharacterB', image=img)
    
    def test_save_drawing_valid(self):
        drawing_data = base64.b64encode(b"fake_image_data").decode('utf-8')
        label = 'CharacterA'
        
        response = self.client.post(reverse('save_drawing'), {
            'drawing': f"data:image/png;base64,{drawing_data}",
            'label': label
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Drawing saved!')

    def test_last_save_drawing_valid(self):
        drawing_data = base64.b64encode(b"fake_image_data").decode('utf-8')
        label = 'CharacterB'
        
        response = self.client.post(reverse('save_drawing'), {
            'drawing': f"data:image/png;base64,{drawing_data}",
            'label': label
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'No more reference. Thank you for contributing!')

    def test_save_drawing_missing_data(self):
        response = self.client.post(reverse('save_drawing'), {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing data')

    def test_save_drawing_no_label(self):
        drawing_data = base64.b64encode(b"fake_image_data").decode('utf-8')
        response = self.client.post(reverse('save_drawing'), {
            'drawing': f"data:image/png;base64,{drawing_data}"
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Missing data')
    
    def test_get_next_reference(self):
        
        drawing_data = base64.b64encode(b"fake_image_data").decode('utf-8')
        label = 'CharacterA'
        
        response = self.client.post(reverse('save_drawing'), {
            'drawing': f"data:image/png;base64,{drawing_data}",
            'label': label
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('next_reference', response.json())
        self.assertEqual(response.json()['next_reference']['label'], 'CharacterB')