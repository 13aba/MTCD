from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home_page'),
    path('test/', views.draw_page, name='draw_page'),
    path('save/', views.save_drawing, name='save_drawing'),
]