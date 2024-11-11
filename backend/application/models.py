from django.contrib.auth.models import AbstractUser
from django.db import models
from collection.models import Room


class User(AbstractUser):
    is_udp = models.BooleanField(
        default=False,
        help_text="Indica si el usuario es un estudiante de la Universidad Diego Portales (UDP)."
    )
    ruf = models.CharField(
        max_length=12,
        unique=True,
        help_text="Rol Único Tributario (RUT) del usuario."
    )
    # Cambiamos los `related_name` para evitar conflictos
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Evita conflicto con 'auth.User.groups'
        blank=True,
        help_text="Los grupos a los que pertenece este usuario."
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Evita conflicto con 'auth.User.user_permissions'
        blank=True,
        help_text="Permisos específicos para este usuario."
    )

    def __str__(self):
        return self.username


class Band(models.Model):
    name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField(
        User,
        through='BandMember',
        related_name='bands',
        help_text="Miembros permanentes de la banda."
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Indica si la banda ha sido aprobada por un administrador."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class BandMember(models.Model):
    band = models.ForeignKey(Band, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('band', 'user')

    def __str__(self):
        return f"{self.user.username} en {self.band.name}"


class Reservation(models.Model):
    band = models.ForeignKey(Band, on_delete=models.CASCADE, related_name='reservations')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reservations')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    guests = models.ManyToManyField(
        User,
        through='Guest',
        related_name='reservations',
        blank=True,
        help_text="Invitados a la sesión de la banda."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.band.name} reservó {self.room.name} de {self.start_time} a {self.end_time}"


class Guest(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    ruf = models.CharField(max_length=12, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        if self.user:
            return f"{self.user.username} invitado a {self.reservation}"
        return f"{self.name} invitado a {self.reservation}"


class Invitation(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='invitations')
    invited_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='invitations')
    invited_name = models.CharField(max_length=100, blank=True, null=True)
    invited_ruf = models.CharField(max_length=12, blank=True, null=True)
    invited_email = models.EmailField(blank=True, null=True)
    invited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.invited_user:
            return f"Invitación de {self.invited_user.username} a {self.reservation}"
        return f"Invitación de {self.invited_name} a {self.reservation}"
