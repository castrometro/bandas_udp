from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstrumentViewSet, RoomViewSet

router = DefaultRouter()
router.register(r'instruments', InstrumentViewSet, basename='instrument')
router.register(r'rooms', RoomViewSet, basename='room')

urlpatterns = [
    path('', include(router.urls)),
]
