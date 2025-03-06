from django.contrib import admin

# Register your models here.
from .models import Station, Route, Ticket

admin.site.register(Station)
admin.site.register(Route)
admin.site.register(Ticket)