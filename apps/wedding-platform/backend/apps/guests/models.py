"""
Models for guests app.
"""
import uuid
from django.db import models
from apps.weddings.models import Wedding


class Guest(models.Model):
    """Represents a guest invited to a wedding."""

    STATUS_CHOICES = [
        ('invited', 'Invited'),
        ('confirmed', 'Confirmed'),
        ('declined', 'Declined'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wedding = models.ForeignKey(
        Wedding,
        on_delete=models.CASCADE,
        related_name='guests',
    )
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='invited')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Guest'
        verbose_name_plural = 'Guests'
        ordering = ['name']

    def __str__(self) -> str:
        return f'{self.name} ({self.wedding.slug})'


class RSVP(models.Model):
    """Represents an RSVP response from a guest."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    guest = models.OneToOneField(
        Guest,
        on_delete=models.CASCADE,
        related_name='rsvp',
    )
    confirmed = models.BooleanField()
    plus_one = models.BooleanField(default=False)
    plus_one_name = models.CharField(max_length=100, blank=True)
    dietary_restrictions = models.TextField(blank=True)
    message = models.TextField(blank=True)
    responded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'RSVP'
        verbose_name_plural = 'RSVPs'
        ordering = ['-responded_at']

    def __str__(self) -> str:
        status = 'Confirmed' if self.confirmed else 'Declined'
        return f'{self.guest.name} — {status}'

    def save(self, *args, **kwargs):
        """Update guest status when RSVP is saved."""
        super().save(*args, **kwargs)
        if self.confirmed:
            self.guest.status = 'confirmed'
        else:
            self.guest.status = 'declined'
        self.guest.save(update_fields=['status'])
