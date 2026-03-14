"""
Serializers for gifts app.
"""
from rest_framework import serializers
from .models import Gift


class GiftSerializer(serializers.ModelSerializer):
    """Serializer for Gift model."""

    class Meta:
        model = Gift
        fields = [
            'id', 'wedding', 'name', 'description', 'price',
            'image_url', 'external_link', 'is_purchased', 'purchased_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
