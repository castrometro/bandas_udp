
from django.contrib import admin
from .models import GlobalSettings

@admin.register(GlobalSettings)
class GlobalSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'max_reservations_per_band_week',
        'available_hours_start',
        'available_hours_end',
        'max_reservation_duration',
        'reservation_advance_limit',
        'max_people_per_room',
    )
    fieldsets = (
        (None, {
            'fields': (
                'max_reservations_per_band_week',
                'available_hours_start',
                'available_hours_end',
                'max_reservation_duration',
                'reservation_advance_limit',
                'max_people_per_room',
            )
        }),
    )
