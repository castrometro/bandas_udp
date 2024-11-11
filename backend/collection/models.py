from django.db import models

class Instrument(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    name = models.CharField(max_length=100, unique=True)
    capacity = models.PositiveIntegerField(
        help_text="Capacidad máxima de personas permitidas en la sala."
    )
    instruments = models.ManyToManyField(
        Instrument,
        related_name='rooms',
        blank=True,
        help_text="Instrumentos disponibles en la sala."
    )

    def __str__(self):
        return self.name
