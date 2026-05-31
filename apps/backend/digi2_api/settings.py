import importlib.util

# Import operating system environment variables
import os

# Import path helper for file locations
from pathlib import Path

# Project base directory
BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default):
    return [
        item.strip()
        for item in os.getenv(name, default).split(",")
        if item.strip()
    ]


def env_bool(name, default):
    return os.getenv(name, default).lower() in ("1", "true", "yes", "on")


# Secret key loaded from environment variable
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("DJANGO_SECRET_KEY is required")

# Debug mode should only be True locally
DEBUG = env_bool("DJANGO_DEBUG", "False")

PUBLIC_IP = os.getenv("PUBLIC_IP", "")
DOMAIN = os.getenv("DOMAIN", "digibab.com")
FRONTEND_PORT = os.getenv("FRONTEND_PORT", "3000")

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID", "")

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

STRIPE_PORTAL_RETURN_URL = os.getenv(
    "STRIPE_PORTAL_RETURN_URL",
    "https://digibab.com/dashboard/customer"
)

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "backend",
    "digi2-backend",
    DOMAIN,
    f"www.{DOMAIN}",
]

if PUBLIC_IP:
    ALLOWED_HOSTS.append(PUBLIC_IP)

CORS_ALLOW_CREDENTIALS = True

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", "False" if DEBUG else "True")
CSRF_COOKIE_SECURE = env_bool("CSRF_COOKIE_SECURE", "False" if DEBUG else "True")
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
    "accounts",
    "billing.apps.BillingConfig",
]

if DEBUG and importlib.util.find_spec("django_extensions"):
    INSTALLED_APPS.append("django_extensions")

# Middleware controls request/response processing
MIDDLEWARE = [
    # Allows frontend to call backend API
    "corsheaders.middleware.CorsMiddleware",

    # Django security middleware
    "django.middleware.security.SecurityMiddleware",
    "common.middleware.RequestTraceLoggingMiddleware",
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
        "HOST": os.getenv("POSTGRES_HOST", "db"),

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
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Default primary key type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom User Model
AUTH_USER_MODEL = "accounts.User"

# Allow Next.js frontend to access Django backend locally
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    f"http://{DOMAIN}",
    f"https://{DOMAIN}",
    f"http://www.{DOMAIN}",
    f"https://www.{DOMAIN}",
]

if PUBLIC_IP:
    CORS_ALLOWED_ORIGINS.extend([
        f"http://{PUBLIC_IP}",
        f"http://{PUBLIC_IP}:{FRONTEND_PORT}",
    ])

# Django REST Framework default settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "authentication.authenticate.CookieJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

CSRF_TRUSTED_ORIGINS = [
    f"http://{DOMAIN}",
    f"https://{DOMAIN}",
    f"http://www.{DOMAIN}",
    f"https://www.{DOMAIN}",
]

if PUBLIC_IP:
    CSRF_TRUSTED_ORIGINS.extend([
        f"http://{PUBLIC_IP}",
        f"http://{PUBLIC_IP}:{FRONTEND_PORT}",
    ])

FORCE_SCRIPT_NAME = None

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {
        "trace_context": {
            "()": "digi2_api.logging_filters.TraceContextFilter",
        },
    },
    "formatters": {
        "verbose": {
            "format": (
                "%(asctime)s "
                "[%(levelname)s] "
                "[trace_id=%(otelTraceID)s span_id=%(otelSpanID)s] "
                "%(name)s: %(message)s"
            ),
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
            "filters": ["trace_context"],
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "businesses": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "accounts": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

if env_bool("OTEL_MANUAL_INSTRUMENTATION_ENABLED", "False"):
    try:
        from config.otel import initialize_otel

        initialize_otel()
    except Exception as e:
        print("OpenTelemetry init failed:", e)
