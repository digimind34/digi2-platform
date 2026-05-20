#!/bin/bash

set -e

BACKEND_VERSION=$1
FRONTEND_VERSION=$2

if [ -z "$BACKEND_VERSION" ] || [ -z "$FRONTEND_VERSION" ]; then
  echo "Usage: ./scripts/deploy-version.sh <backend-version> <frontend-version>"
  echo "Example: ./scripts/deploy-version.sh v1.28 v1.18"
  exit 1
fi

echo "Deploying backend: $BACKEND_VERSION"
echo "Deploying frontend: $FRONTEND_VERSION"

sed -i "s/^BACKEND_IMAGE_TAG=.*/BACKEND_IMAGE_TAG=$BACKEND_VERSION/" .env
sed -i "s/^FRONTEND_IMAGE_TAG=.*/FRONTEND_IMAGE_TAG=$FRONTEND_VERSION/" .env

docker-compose pull
docker-compose up -d
docker-compose ps

echo "Deployment complete."