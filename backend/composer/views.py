# composer/views.py

from rest_framework import viewsets
from .models import GlobalSettings
from .serializers import GlobalSettingsSerializer
from rest_framework.permissions import IsAdminUser

class GlobalSettingsViewSet(viewsets.ModelViewSet):
    queryset = GlobalSettings.objects.all()
    serializer_class = GlobalSettingsSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Asumiendo que solo hay una instancia de GlobalSettings
        return GlobalSettings.objects.all()
