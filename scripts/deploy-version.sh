#!/bin/bash

set -e

BACKEND_VERSION=$1
FRONTEND_VERSION=$2
HEALTH_URL="https://digibab.com/"
LOG_FILE="deployment-history/releases.log"

if [ -z "$BACKEND_VERSION" ] || [ -z "$FRONTEND_VERSION" ]; then
  echo "Usage: ./scripts/deploy-version.sh <backend-version> <frontend-version>"
  echo "Example: ./scripts/deploy-version.sh v1.28 v1.18"
  exit 1
fi

CURRENT_BACKEND=$(grep "^BACKEND_IMAGE_TAG=" .env | cut -d "=" -f2)
CURRENT_FRONTEND=$(grep "^FRONTEND_IMAGE_TAG=" .env | cut -d "=" -f2)

echo "Current backend: $CURRENT_BACKEND"
echo "Current frontend: $CURRENT_FRONTEND"

echo "Deploying backend: $BACKEND_VERSION"
echo "Deploying frontend: $FRONTEND_VERSION"

sed -i "s/^BACKEND_IMAGE_TAG=.*/BACKEND_IMAGE_TAG=$BACKEND_VERSION/" .env
sed -i "s/^FRONTEND_IMAGE_TAG=.*/FRONTEND_IMAGE_TAG=$FRONTEND_VERSION/" .env

docker-compose pull
docker-compose up -d

echo "Waiting for services to stabilize..."
sleep 20

echo "Checking health: $HEALTH_URL"

if curl -fsI "$HEALTH_URL" >/dev/null; then
  echo "Health check passed."

  echo "$(date '+%Y-%m-%d %H:%M:%S') DEPLOY SUCCESS backend=$BACKEND_VERSION frontend=$FRONTEND_VERSION previous_backend=$CURRENT_BACKEND previous_frontend=$CURRENT_FRONTEND" >> "$LOG_FILE"

  docker-compose ps

  echo "Deployment complete."
else
  echo "Health check failed. Rolling back..."

  sed -i "s/^BACKEND_IMAGE_TAG=.*/BACKEND_IMAGE_TAG=$CURRENT_BACKEND/" .env
  sed -i "s/^FRONTEND_IMAGE_TAG=.*/FRONTEND_IMAGE_TAG=$CURRENT_FRONTEND/" .env

  docker-compose pull
  docker-compose up -d

  echo "$(date '+%Y-%m-%d %H:%M:%S') DEPLOY FAILED rollback_to_backend=$CURRENT_BACKEND rollback_to_frontend=$CURRENT_FRONTEND failed_backend=$BACKEND_VERSION failed_frontend=$FRONTEND_VERSION" >> "$LOG_FILE"

  docker-compose ps

  echo "Rollback complete."
  exit 1
fi