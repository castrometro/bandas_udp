from rest_framework.permissions import BasePermission

from application.models import BandMember


class IsUDPUser(BasePermission):
    """
    Permiso para permitir solo a usuarios UDP autenticados.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_udp)

class IsBandMember(BasePermission):
    """
    Permiso para permitir solo a miembros de la banda que están intentando acceder al objeto.
    """
    def has_object_permission(self, request, view, obj):
        return BandMember.objects.filter(band=obj.band, user=request.user).exists()