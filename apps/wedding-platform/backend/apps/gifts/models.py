"""
Models for gifts app.
"""
import uuid
from django.db import models
from apps.weddings.models import Wedding


class Gift(models.Model):
    """Represents a gift on a wedding gift list."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(
        Wedding,
        on_delete=models.CASCADE,
        related_name='gifts',
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField(blank=True)
    external_link = models.URLField(blank=True)
    is_purchased = models.BooleanField(default=False)
    purchased_by = models.CharField(
        max_length=100,
        blank=True,
        help_text='Name of the guest who purchased/reserved this gift',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Gift'
        verbose_name_plural = 'Gifts'
        ordering = ['name']

    def __str__(self) -> str:
        return f'{self.name} ({self.wedding.slug})'
