"""
Views for gifts app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Gift
from .serializers import GiftSerializer


class GiftViewSet(viewsets.ModelViewSet):
    """ViewSet for Gift. Public list/retrieve, authenticated create/update/delete."""

    serializer_class = GiftSerializer

    def get_permissions(self):
        """List and retrieve are public (for guest gift list). Everything else requires auth."""
        if self.action in ('list', 'retrieve', 'mark_purchased'):
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """Return gifts filtered by wedding if authenticated, or all if public."""
        if self.request.user.is_authenticated:
            return Gift.objects.filter(wedding__couple=self.request.user)
        # Public access: filter by wedding_id query param
        wedding_id = self.request.query_params.get('wedding_id')
        if wedding_id:
            return Gift.objects.filter(wedding_id=wedding_id)
        return Gift.objects.all()

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], url_path='mark-purchased')
    def mark_purchased(self, request, pk=None):
        """Mark a gift as purchased by a guest."""
        gift = self.get_object()
        if gift.is_purchased:
            return Response(
                {'detail': 'This gift has already been purchased.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        purchased_by = request.data.get('purchased_by', '')
        gift.is_purchased = True
        gift.purchased_by = purchased_by
        gift.save(update_fields=['is_purchased', 'purchased_by'])
        serializer = self.get_serializer(gift)
        return Response(serializer.data)
