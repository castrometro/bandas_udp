from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Band, BandMember, Reservation, Guest, Invitation

User = get_user_model()



class CurrentUserSerializer(serializers.ModelSerializer):
    current_band = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_udp', 'ruf', 'current_band']

    def get_current_band(self, obj):
        try:
            band = obj.bands.first()
            if band :
                return {
                    'id' : band.id,
                    'name' : band.name,
                    'members' : BandMemberSerializer(band.bandmember_set.all(), many=True).data
                }
            return None
        except Band.DoesNotExist:
            return None


class UserRegistrationSerializer(serializers.ModelSerializer) :
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    is_udp = serializers.BooleanField(write_only=True, required=True,
                                      help_text="Indica si el usuario es UDP (True) o Externo (False).")

    class Meta :
        model = User
        fields = ('username', 'email', 'ruf', 'password', 'is_udp')

    def create(self, validated_data) :
        is_udp = validated_data.pop('is_udp')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.is_udp = is_udp
        user.set_password(password)

        if is_udp :
            user.is_active = False  # Requiere aprobación del administrador
        else :
            user.is_active = True  # Activación inmediata

        user.save()
        return user

class UserLogoutSerializer(serializers.Serializer):
    message = serializers.CharField(read_only=True, default="Successfully logged out")

class UserLoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta :
        model = User
        fields = ('username', 'password')

    def validate(self, attrs) :
        try:
            username = attrs.get('username')
            password = attrs.get('password')

            user = User.objects.get(username=username)
            if not user.check_password(password) :
                raise serializers.ValidationError("Usuario o contraseña incorrectos.")

            return attrs
        except User.DoesNotExist :
            raise serializers.ValidationError("Usuario o contraseña incorrectos.")
        except Exception as e :
            raise serializers.ValidationError(e)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_udp', 'ruf']


class BandSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False,  # Los miembros se gestionan mediante BandMemberViewSet
        help_text="IDs de los miembros iniciales (Usuarios UDP y/o Externos)."
    )
    is_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = Band
        fields = ['id', 'name', 'members', 'is_approved', 'created_at']
        read_only_fields = ['id', 'is_approved', 'created_at']

    def validate_name(self, value):
        if Band.objects.filter(name=value).exists():
            raise serializers.ValidationError("El nombre de la banda ya está en uso.")
        return value

    def validate_members(self, value):
        udp_members = [user for user in value if user.is_udp]

        for user in udp_members:
            if BandMember.objects.filter(user=user).exists():
                raise serializers.ValidationError(f"El usuario UDP '{user.username}' ya pertenece a otra banda.")

        return value

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        band = Band.objects.create(**validated_data)
        user = self.context['request'].user
        BandMember.objects.create(band=band, user=user)
        # Añadir miembros adicionales si se proporcionan
        for member in members:
            BandMember.objects.create(band=band, user=member)
        return band


class BandMemberSerializer(serializers.ModelSerializer) :
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Para pasar solo el ID en la creación

    class Meta :
        model = BandMember
        fields = ['id', 'band', 'user', 'joined_at']
        read_only_fields = ['id', 'joined_at']


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = UserSerializer(instance.user).data
        return representation

    def validate(self, attrs):
        user = attrs.get('user')
        band = attrs.get('band')
        # Asegúrate de que `user` no sea `None`

        if user and user.is_udp:
            if BandMember.objects.filter(band=band, user=user).exists() :
                raise serializers.ValidationError("Este usuario ya es miembro de la banda.")
            if BandMember.objects.filter(user=user).exclude(band=band).exists():
                raise serializers.ValidationError(
                    "Un Usuario UDP solo puede pertenecer a una banda como miembro permanente."
                )
        return attrs




class ReservationSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Reservation
        fields = ['id', 'band', 'room', 'start_time', 'end_time', 'guests', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs) :
        band = attrs.get('band')
        user = self.context['request'].user

        # Verificar que el usuario pertenece a la banda
        if not BandMember.objects.filter(band=band, user=user).exists() :
            raise serializers.ValidationError("Solo los miembros de la banda pueden realizar reservas.")

        # Validar horarios y número de reservas (se manejará en la lógica de negocio)
        return attrs


class GuestSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Guest
        fields = ['id', 'reservation', 'user', 'name', 'ruf', 'email']
        read_only_fields = ['id']

    def validate(self, attrs) :
        reservation = attrs.get('reservation')
        user = attrs.get('user')
        name = attrs.get('name')

        # Verificar que la sala no exceda su capacidad
        if reservation.room :
            current_guests = Guest.objects.filter(reservation=reservation).count()
            if current_guests >= reservation.room.capacity :
                raise serializers.ValidationError("La sala ha alcanzado su capacidad máxima de personas.")

        return attrs

class InvitationSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Invitation
        fields = ['id', 'reservation', 'invited_user', 'invited_name', 'invited_ruf', 'invited_email', 'invited_at']
        read_only_fields = ['id', 'invited_at']

class DashboardStatsSerializer(serializers.Serializer):
    totalReservations = serializers.IntegerField()
    upcomingReservations = serializers.IntegerField()
    bandCount = serializers.IntegerField()