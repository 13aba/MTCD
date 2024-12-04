
# Register your models here.
from django.contrib import admin
from .models import *

#Register the database tables into admin page
admin.site.register(Drawing)
admin.site.register(Reference)