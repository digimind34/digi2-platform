# Import operating system environment tools
import os

# Import Django ASGI application factory
from django.core.asgi import get_asgi_application

# Set default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "digi2_api.settings")

# Create ASGI application for async-compatible servers
application = get_asgi_application()