# collection/views.py

from rest_framework import viewsets
from .models import Instrument, Room
from .serializers import InstrumentSerializer, RoomSerializer
from rest_framework.permissions import IsAuthenticated

class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer
    permission_classes = [IsAuthenticated]

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
