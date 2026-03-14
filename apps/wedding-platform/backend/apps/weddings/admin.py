"""
Admin configuration for weddings app.
"""
from django.contrib import admin
from .models import Wedding, WeddingPage


@admin.register(Wedding)
class WeddingAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'couple', 'wedding_date', 'is_published', 'created_at']
    list_filter = ['is_published', 'wedding_date', 'created_at']
    search_fields = ['title', 'slug', 'bride_name', 'groom_name', 'couple__email']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at']
    prepopulated_fields = {'slug': ('bride_name', 'groom_name')}


@admin.register(WeddingPage)
class WeddingPageAdmin(admin.ModelAdmin):
    list_display = ['wedding', 'section_type', 'order', 'is_visible']
    list_filter = ['section_type', 'is_visible']
    search_fields = ['wedding__title', 'wedding__slug']
    ordering = ['wedding', 'order']
    readonly_fields = ['id']
