"""
Models for weddings app.
"""
import uuid
from django.conf import settings
from django.db import models


class Wedding(models.Model):
    """Represents a wedding created by a couple."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    couple = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='weddings',
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, help_text='This is the subdomain for the wedding site.')
    bride_name = models.CharField(max_length=255)
    groom_name = models.CharField(max_length=255)
    wedding_date = models.DateField(null=True, blank=True)
    venue_name = models.CharField(max_length=255, blank=True)
    venue_address = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='weddings/covers/', null=True, blank=True)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Wedding'
        verbose_name_plural = 'Weddings'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.bride_name} & {self.groom_name} ({self.slug})'


class WeddingPage(models.Model):
    """Represents a section/page of a wedding site with JSON content."""

    SECTION_CHOICES = [
        ('home', 'Home'),
        ('event', 'Event'),
        ('gallery', 'Gallery'),
        ('gifts', 'Gifts'),
        ('rsvp', 'RSVP'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(
        Wedding,
        on_delete=models.CASCADE,
        related_name='pages',
    )
    section_type = models.CharField(max_length=20, choices=SECTION_CHOICES)
    content = models.JSONField(default=dict)
    order = models.IntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Wedding Page'
        verbose_name_plural = 'Wedding Pages'
        unique_together = [('wedding', 'section_type')]
        ordering = ['order']

    def __str__(self) -> str:
        return f'{self.wedding.slug} — {self.section_type}'
