# Import Django database model tools
from django.db import models


class Business(models.Model):
    # Business type choices for handyman-related services
    BUSINESS_TYPES = [
        ("handyman", "Handyman"),
        ("electrician", "Electrician"),
        ("plumber", "Plumber"),
        ("cleaning", "Cleaning"),
        ("other", "Other"),
    ]

    # Business name
    name = models.CharField(max_length=255)

    # Owner or manager name
    owner_name = models.CharField(max_length=255)

    # Type of business selected from BUSINESS_TYPES
    business_type = models.CharField(
        max_length=50,
        choices=BUSINESS_TYPES,
        default="handyman",
    )

    # City where the business operates
    city = models.CharField(max_length=120, default="Toronto")

    # Optional phone number
    phone = models.CharField(max_length=50, blank=True)

    # Optional email address
    email = models.EmailField(blank=True)

    # Business description
    description = models.TextField(blank=True)

    # Unique URL-friendly slug for future website pages
    website_slug = models.SlugField(unique=True)

    # Whether the business profile is active
    is_active = models.BooleanField(default=True)

    # Date/time when profile was created
    created_at = models.DateTimeField(auto_now_add=True)

    # Date/time when profile was last updated
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Human-readable name in Django admin
        return self.name