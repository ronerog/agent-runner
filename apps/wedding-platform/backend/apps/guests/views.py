"""
Views for guests app.
"""
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Guest, RSVP
from .serializers import GuestSerializer, RSVPSerializer


class GuestViewSet(viewsets.ModelViewSet):
    """ViewSet for Guest CRUD. Restricted to authenticated couple."""

    serializer_class = GuestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only guests for weddings belonging to the current user."""
        return Guest.objects.filter(wedding__couple=self.request.user).select_related('rsvp')


class RSVPViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """ViewSet for RSVP. Anyone can create (guest submitting). Auth required for list/retrieve."""

    serializer_class = RSVPSerializer

    def get_permissions(self):
        """Allow unauthenticated access for RSVP creation."""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Return RSVPs for weddings belonging to the current user."""
        if self.request.user.is_authenticated:
            return RSVP.objects.filter(guest__wedding__couple=self.request.user)
        return RSVP.objects.none()
