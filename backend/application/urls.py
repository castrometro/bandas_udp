# application/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    UserRegistrationView,
    BandViewSet,
    BandMemberViewSet,
    ReservationViewSet,
    GuestViewSet,
    InvitationViewSet,
    UserLoginView,
    DashboardStatsView,
    CurrentUserView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'bands', BandViewSet, basename='band')
router.register(r'band-members', BandMemberViewSet, basename='bandmember')
router.register(r'reservations', ReservationViewSet, basename='reservation')
router.register(r'guests', GuestViewSet, basename='guest')
router.register(r'invitations', InvitationViewSet, basename='invitation')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
]
