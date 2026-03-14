"""
Serializers for weddings app.
"""
from rest_framework import serializers
from .models import Wedding, WeddingPage


class WeddingPageSerializer(serializers.ModelSerializer):
    """Serializer for WeddingPage model."""

    class Meta:
        model = WeddingPage
        fields = ['id', 'wedding', 'section_type', 'content', 'order', 'is_visible']
        read_only_fields = ['id']


class WeddingSerializer(serializers.ModelSerializer):
    """Serializer for Wedding model."""

    couple = serializers.PrimaryKeyRelatedField(read_only=True)
    pages = WeddingPageSerializer(many=True, read_only=True)

    class Meta:
        model = Wedding
        fields = [
            'id', 'couple', 'title', 'slug', 'bride_name', 'groom_name',
            'wedding_date', 'venue_name', 'venue_address', 'cover_image',
            'description', 'is_published', 'created_at', 'pages'
        ]
        read_only_fields = ['id', 'couple', 'created_at']

    def validate_slug(self, value: str) -> str:
        """Ensure slug is lowercase and URL-safe."""
        return value.lower().strip()
