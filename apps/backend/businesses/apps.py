# Import Django app configuration class
from django.apps import AppConfig


class BusinessesConfig(AppConfig):
    # Use BigAutoField for primary keys
    default_auto_field = "django.db.models.BigAutoField"

    # App name used by Django
    name = "businesses"