# composer/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlobalSettingsViewSet

router = DefaultRouter()
router.register(r'global-settings', GlobalSettingsViewSet, basename='globalsettings')

urlpatterns = [
    path('', include(router.urls)),
]
