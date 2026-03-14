"""
Admin configuration for gifts app.
"""
from django.contrib import admin
from .models import Gift


@admin.register(Gift)
class GiftAdmin(admin.ModelAdmin):
    list_display = ['name', 'wedding', 'price', 'is_purchased', 'purchased_by', 'created_at']
    list_filter = ['is_purchased', 'wedding', 'created_at']
    search_fields = ['name', 'wedding__title', 'wedding__slug', 'purchased_by']
    ordering = ['wedding', 'name']
    readonly_fields = ['id', 'created_at']
