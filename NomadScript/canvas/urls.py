from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home_page'),
    path('learn/', views.learn_page, name='learn_page'),
    path('contribute/', views.contribute_page, name='contribute_page'),
    path('about/', views.about_page, name='about_page'),
    path('contribute/save/', views.save_drawing, name='save_drawing'),
    path('learn/predict/', views.predict_drawing, name='predict_drawing'),
]