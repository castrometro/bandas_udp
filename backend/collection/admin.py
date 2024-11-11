# collection/admin.py

from django.contrib import admin
from .models import Instrument, Room

@admin.register(Instrument)
class InstrumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity')
    search_fields = ('name',)
    filter_horizontal = ('instruments',)
    fieldsets = (
        (None, {
            'fields': ('name', 'capacity', 'instruments')
        }),
    )
