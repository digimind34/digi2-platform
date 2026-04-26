#!/usr/bin/env python

# Import operating system tools
import os

# Import system command-line tools
import sys


def main():
    # Tell Django which settings file to use
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "digi2_api.settings")

    # Import Django command executor
    from django.core.management import execute_from_command_line

    # Run Django management commands
    execute_from_command_line(sys.argv)


# Run main function only when this file is executed directly
if __name__ == "__main__":
    main()