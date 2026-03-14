"""
Serializers for guests app.
"""
from rest_framework import serializers
from .models import Guest, RSVP


class RSVPSerializer(serializers.ModelSerializer):
    """Serializer for RSVP model."""

    class Meta:
        model = RSVP
        fields = [
            'id', 'guest', 'confirmed', 'plus_one', 'plus_one_name',
            'dietary_restrictions', 'message', 'responded_at'
        ]
        read_only_fields = ['id', 'responded_at']


class GuestSerializer(serializers.ModelSerializer):
    """Serializer for Guest model."""

    rsvp = RSVPSerializer(read_only=True)

    class Meta:
        model = Guest
        fields = ['id', 'wedding', 'name', 'email', 'phone', 'status', 'created_at', 'rsvp']
        read_only_fields = ['id', 'created_at', 'status']
