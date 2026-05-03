# Import operating system environment variables
import os

# Import path helper for file locations
from pathlib import Path

# Project base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key loaded from environment variable
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret-key")

# Debug mode should only be True locally
DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True"

# Allowed hosts are loaded as a comma-separated list
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# Installed Django and third-party apps
INSTALLED_APPS = [
    # Django default apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps
    "rest_framework",
    "corsheaders",

    # Digi2 business app
    "businesses",
]

# Middleware controls request/response processing
MIDDLEWARE = [
    # Allows frontend to call backend API
    "corsheaders.middleware.CorsMiddleware",

    # Django security middleware
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    # Session management
    "django.contrib.sessions.middleware.SessionMiddleware",

    # Common HTTP middleware
    "django.middleware.common.CommonMiddleware",

    # CSRF protection
    "django.middleware.csrf.CsrfViewMiddleware",

    # User authentication
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    # Flash messages
    "django.contrib.messages.middleware.MessageMiddleware",

    # Clickjacking protection
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Main project URL file
ROOT_URLCONF = "digi2_api.urls"

# Template configuration for admin and server-rendered pages
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        # No custom template directories yet
        "DIRS": [],

        # Allow templates inside installed apps
        "APP_DIRS": True,

        # Default context processors
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

# WSGI application path for production server
WSGI_APPLICATION = "digi2_api.wsgi.application"

# PostgreSQL database configuration
DATABASES = {
    "default": {
        # Use PostgreSQL database engine
        "ENGINE": "django.db.backends.postgresql",

        # Database name from .env
        "NAME": os.getenv("POSTGRES_DB", "digi2"),

        # Database username from .env
        "USER": os.getenv("POSTGRES_USER", "digi2_user"),

        # Database password from .env
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "digi2_password"),

        # Database host; inside Docker this is the service name: db
        "HOST": os.getenv("POSTGRES_HOST", "localhost"),

        # PostgreSQL default port
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

# Language and timezone settings
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files path
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Default primary key type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Allow Next.js frontend to access Django backend locally
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Django REST Framework default settings
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        # Allow public access for learning/dev stage
        "rest_framework.permissions.AllowAny",
    ],
}

FORCE_SCRIPT_NAME = None
