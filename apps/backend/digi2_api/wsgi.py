# Import operating system environment tools
import os

# Import Django WSGI application factory
from django.core.wsgi import get_wsgi_application

# Set default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "digi2_api.settings")

# Create WSGI application for production servers like Gunicorn
application = get_wsgi_application()