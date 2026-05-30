from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Subscription(models.Model):
    PLAN_CHOICES = [
        ("free", "Free"),
        ("starter", "Starter"),
        ("pro", "Pro"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="subscription"
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        default="free"
    )

    stripe_customer_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    stripe_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.plan}"