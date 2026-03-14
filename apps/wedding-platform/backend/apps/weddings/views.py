"""
Views for weddings app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Wedding, WeddingPage
from .serializers import WeddingSerializer, WeddingPageSerializer


class WeddingViewSet(viewsets.ModelViewSet):
    """ViewSet for Wedding CRUD operations."""

    serializer_class = WeddingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only weddings belonging to the current user."""
        return Wedding.objects.filter(couple=self.request.user)

    def perform_create(self, serializer):
        """Set the couple to the current user on create."""
        serializer.save(couple=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-slug/(?P<slug>[^/.]+)', permission_classes=[AllowAny])
    def by_slug(self, request, slug=None):
        """Public endpoint: get wedding by slug."""
        wedding = get_object_or_404(Wedding, slug=slug)
        serializer = self.get_serializer(wedding)
        return Response(serializer.data)


class WeddingPageViewSet(viewsets.ModelViewSet):
    """ViewSet for WeddingPage CRUD operations."""

    serializer_class = WeddingPageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only pages for weddings belonging to the current user."""
        return WeddingPage.objects.filter(wedding__couple=self.request.user)
