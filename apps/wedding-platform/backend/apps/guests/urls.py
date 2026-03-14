"""
URL configuration for guests app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GuestViewSet, RSVPViewSet

router = DefaultRouter()
router.register(r'', GuestViewSet, basename='guest')
router.register(r'rsvp', RSVPViewSet, basename='rsvp')

urlpatterns = [
    path('', include(router.urls)),
]
