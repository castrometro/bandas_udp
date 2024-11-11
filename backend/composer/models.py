# composer/models.py

from django.db import models

class GlobalSettings(models.Model):
    max_reservations_per_band_week = models.PositiveIntegerField(
        default=1,
        help_text="Número máximo de reservas que una banda puede realizar por semana (0-7)."
    )
    available_hours_start = models.TimeField(
        default="08:00",
        help_text="Hora de inicio disponible para reservas."
    )
    available_hours_end = models.TimeField(
        default="22:00",
        help_text="Hora de cierre disponible para reservas."
    )
    max_reservation_duration = models.DurationField(
        default="01:00:00",
        help_text="Duración máxima permitida por reserva."
    )
    reservation_advance_limit = models.PositiveIntegerField(
        default=14,
        help_text="Anticipación máxima en días para realizar reservas."
    )
    max_people_per_room = models.PositiveIntegerField(
        default=10,
        help_text="Número máximo de personas permitidas en cada sala por razones de seguridad."
    )

    def __str__(self):
        return "Configuraciones Globales del Sistema"


