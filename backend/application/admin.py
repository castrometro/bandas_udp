from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Band, BandMember, Reservation, Guest, Invitation


# Inline para gestionar BandMember dentro de BandAdmin
class BandMemberInline(admin.TabularInline):
    model = BandMember
    extra = 1

# Inline para gestionar Guest dentro de ReservationAdmin
class GuestInline(admin.TabularInline):
    model = Guest
    extra = 1

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Campos que se mostrarán en la lista de usuarios
    list_display = ('username', 'email', 'is_udp', 'ruf', 'is_staff', 'is_active')
    list_filter = ('is_udp', 'is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email', 'ruf')
    ordering = ('username',)

    # Definición de los fieldsets para la página de detalle del usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Información Personal'), {'fields': ('first_name', 'last_name', 'email', 'ruf')}),
        (_('Permisos'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_udp', 'groups', 'user_permissions'),
        }),
        (_('Fechas Importantes'), {'fields': ('last_login', 'date_joined')}),
    )

    # Definición de los fieldsets para la página de creación de usuarios
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'ruf', 'password1', 'password2', 'is_udp', 'is_staff', 'is_active'),
        }),
    )

    # Configuración de campos de filtro horizontal para grupos y permisos
    filter_horizontal = ('groups', 'user_permissions',)

@admin.register(Band)
class BandAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    inlines = [BandMemberInline]

@admin.register(BandMember)
class BandMemberAdmin(admin.ModelAdmin):
    list_display = ('band', 'user', 'joined_at')
    search_fields = ('band__name', 'user__username')
    list_filter = ('band', 'user')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('band', 'room', 'start_time', 'end_time', 'created_at')
    list_filter = ('band', 'room', 'start_time', 'end_time')
    search_fields = ('band__name', 'room__name')
    inlines = [GuestInline]


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'user', 'name', 'ruf', 'email')
    search_fields = ('reservation__band__name', 'user__username', 'name', 'ruf')
    list_filter = ('reservation', 'user')

@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'invited_user', 'invited_name', 'invited_email', 'invited_at')
    search_fields = ('reservation__band__name', 'invited_user__username', 'invited_name', 'invited_email')
    list_filter = ('reservation', 'invited_user', 'invited_at')
