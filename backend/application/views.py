# application/views.py
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status, viewsets, filters
from django.contrib.auth import get_user_model
from .models import Band, BandMember, Reservation, Guest, Invitation
from .serializers import (
    UserSerializer,
    BandSerializer,
    BandMemberSerializer,
    ReservationSerializer,
    GuestSerializer,
    InvitationSerializer, UserRegistrationSerializer, UserLoginSerializer, DashboardStatsSerializer,
    CurrentUserSerializer
)
from rest_framework.permissions import  IsAuthenticated, AllowAny
from rest_framework import permissions
from .permissions import IsUDPUser, IsBandMember

from rest_framework.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from rest_framework.response import Response
from rest_framework.decorators import action



User = get_user_model()

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Obtener las bandas a las que pertenece el usuario
        user_bands = Band.objects.filter(members=user)

        band_count = user_bands.count()

        # Obtener todas las reservas de las bandas del usuario
        total_reservations = Reservation.objects.filter(band__in=user_bands).count()

        # Obtener las reservas próximas (start_time >= ahora)
        now = timezone.now()
        upcoming_reservations = Reservation.objects.filter(band__in=user_bands, start_time__gte=now).count()

        stats = {
            'totalReservations': total_reservations,
            'upcomingReservations': upcoming_reservations,
            'bandCount': band_count
        }

        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ruf']


class BandViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar bandas. Solo Usuarios UDP pueden crear y editar bandas a las que pertenecen.
    """
    queryset = Band.objects.all()
    serializer_class = BandSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    # def get_queryset(self):
    #     if self.action == 'list':
    #         # Solo listar bandas aprobadas para los usuarios que no pertenecen a ninguna banda
    #         user = self.request.user
    #         if not Band.objects.filter(members=user, is_approved=True).exists():
    #             return Band.objects.filter(is_approved=True)
    #         else:
    #             return Band.objects.none()  # Si pertenece a una banda, no listar
    #     return super().get_queryset()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsUDPUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Verificar que el usuario UDP no pertenece a otra banda
        user = self.request.user
        if BandMember.objects.filter(user=user, band__is_approved=True).exists():
            raise ValidationError("Ya perteneces a una banda como miembro permanente.")
        band = serializer.save(is_approved=True)


class BandMemberViewSet(viewsets.ModelViewSet) :
    """
    ViewSet para gestionar miembros de bandas. Solo miembros UDP de la banda pueden modificarla.
    """
    queryset = BandMember.objects.all()
    serializer_class = BandMemberSerializer
    permission_classes = [IsAuthenticated, IsBandMember]

    def perform_create(self, serializer) :
        band = serializer.validated_data['band']
        user = self.request.user
        print(user)

        # Verificar que el usuario es miembro UDP de la banda
        if not BandMember.objects.filter(band=band, user=user).exists() :
            raise ValidationError("Solo miembros UDP de la banda pueden agregar o remover integrantes.")

        serializer.save()

    def perform_destroy(self, instance) :
        band = instance.band
        user = self.request.user

        # Verificar que el usuario es miembro UDP de la banda
        if not BandMember.objects.filter(band=band, user=user).exists() :
            raise ValidationError("Solo miembros UDP de la banda pueden eliminar integrantes.")

        instance.delete()


# application/views.py

class ReservationViewSet(viewsets.ModelViewSet) :
    """
    ViewSet para gestionar reservas. Solo miembros de la banda pueden crear reservas.
    """
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer) :
        band = serializer.validated_data['band']
        user = self.request.user

        # Verificar que el usuario es miembro de la banda
        if not BandMember.objects.filter(band=band, user=user).exists() :
            raise ValidationError("Solo los miembros de la banda pueden realizar reservas.")

        # Obtener configuraciones globales
        from composer.models import GlobalSettings
        settings = GlobalSettings.objects.first()
        if not settings :
            raise ValidationError("Configuraciones globales no definidas.")

        # Calcular la semana actual
        now = timezone.now()
        start_of_week = now - timedelta(days=now.weekday())  # Lunes
        end_of_week = start_of_week + timedelta(days=7)

        # Contar las reservas de la banda en la semana actual
        current_week_reservations = Reservation.objects.filter(
            band=band,
            start_time__gte=start_of_week,
            start_time__lt=end_of_week
        ).count()

        if current_week_reservations >= settings.max_reservations_per_band_week :
            raise ValidationError(
                f"Has alcanzado el número máximo de reservas ({settings.max_reservations_per_band_week}) para esta semana.")

        # Validar horarios disponibles
        if not (settings.available_hours_start <= serializer.validated_data[
            'start_time'].time() <= settings.available_hours_end and
                settings.available_hours_start <= serializer.validated_data[
                    'end_time'].time() <= settings.available_hours_end) :
            raise ValidationError("Las reservas deben estar dentro de los horarios disponibles.")

        # Validar duración máxima
        reservation_duration = serializer.validated_data['end_time'] - serializer.validated_data['start_time']
        if reservation_duration > settings.max_reservation_duration :
            raise ValidationError(
                f"La duración máxima de la reserva es {settings.max_reservation_duration}.")

        # Verificar disponibilidad de la sala
        room = serializer.validated_data['room']
        overlapping_reservations = Reservation.objects.filter(
            room=room,
            start_time__lt=serializer.validated_data['end_time'],
            end_time__gt=serializer.validated_data['start_time']
        )
        if overlapping_reservations.exists() :
            raise ValidationError("La sala ya está reservada en el horario seleccionado.")

        serializer.save()


class GuestViewSet(viewsets.ModelViewSet) :
    """
    ViewSet para gestionar invitados. Solo miembros de la banda pueden agregar invitados.
    """
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    permission_classes = [IsAuthenticated, IsBandMember]

    def perform_create(self, serializer) :
        reservation = serializer.validated_data['reservation']
        user = self.request.user

        # Verificar que el usuario es miembro de la banda asociada a la reserva
        if not BandMember.objects.filter(band=reservation.band, user=user).exists() :
            raise ValidationError("Solo miembros de la banda pueden agregar invitados.")

        serializer.save()


class InvitationViewSet(viewsets.ModelViewSet) :
    """
    ViewSet para gestionar invitaciones. Solo miembros de la banda pueden crear invitaciones.
    """
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated, IsBandMember]

    def perform_create(self, serializer) :
        reservation = serializer.validated_data['reservation']
        user = self.request.user

        # Verificar que el usuario es miembro de la banda asociada a la reserva
        if not BandMember.objects.filter(band=reservation.band, user=user).exists() :
            raise ValidationError("Solo miembros de la banda pueden crear invitaciones.")

        serializer.save()


class UserRegistrationView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class UserLoginView(APIView):
    def post(self, request):
        form = AuthenticationForm(data=request.data)
        if form.is_valid():
            user = form.get_user()
            login(request, user)  # Inicia sesión y crea una sesión de Django
            return Response({"message": "Inicio de sesión exitoso"}, status=status.HTTP_200_OK)
        return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)

# application/views.py


    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_udp:
            raise ValidationError("Solo los usuarios UDP pueden solicitar la creación de bandas.")
        if BandMember.objects.filter(user=user).exists():
            raise ValidationError("Ya perteneces a una banda.")
        if Band.objects.filter(name=serializer.validated_data['name']).exists():
            raise ValidationError("Ya existe una banda con este nombre.")
        serializer.save(requested_by=user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        band_request = self.get_object()
        if band_request.is_approved:
            return Response({"detail": "Esta solicitud ya ha sido aprobada."}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la banda
        band = Band.objects.create(name=band_request.name)
        BandMember.objects.create(band=band, user=band_request.requested_by)
        band_request.is_approved = True
        band_request.save()
        return Response({"detail": f"Banda {band.name} creada y aprobada."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        band_request = self.get_object()
        if band_request.is_approved:
            return Response({"detail": "Esta solicitud ya ha sido aprobada."}, status=status.HTTP_400_BAD_REQUEST)
        band_request.delete()
        return Response({"detail": "Solicitud rechazada y eliminada."}, status=status.HTTP_200_OK)
