"""
Admin configuration for guests app.
"""
from django.contrib import admin
from .models import Guest, RSVP


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ['name', 'wedding', 'email', 'phone', 'status', 'created_at']
    list_filter = ['status', 'wedding', 'created_at']
    search_fields = ['name', 'email', 'wedding__title', 'wedding__slug']
    ordering = ['name']
    readonly_fields = ['id', 'created_at']


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ['guest', 'confirmed', 'plus_one', 'responded_at']
    list_filter = ['confirmed', 'plus_one', 'responded_at']
    search_fields = ['guest__name', 'guest__email']
    ordering = ['-responded_at']
    readonly_fields = ['id', 'responded_at']
