# Use a lightweight official Python image
FROM python:3.12-slim

# Prevent Python from writing .pyc cache files
ENV PYTHONDONTWRITEBYTECODE=1

# Make Python output logs immediately
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system packages needed for PostgreSQL Python driver
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency file first for better Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code into the container
COPY . .

# Expose Django/Gunicorn port
EXPOSE 8000

# Default production command
CMD ["gunicorn", "digi2_api.wsgi:application", "--bind", "0.0.0.0:8000"]