"""
App configuration for weddings app.
"""
from django.apps import AppConfig


class WeddingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.weddings'
    verbose_name = 'Weddings'
