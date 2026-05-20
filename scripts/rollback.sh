#!/bin/bash

set -e

BACKEND_VERSION=$1
FRONTEND_VERSION=$2

if [ -z "$BACKEND_VERSION" ] || [ -z "$FRONTEND_VERSION" ]; then
  echo "Usage: ./scripts/rollback.sh <backend-version> <frontend-version>"
  echo "Example: ./scripts/rollback.sh v1.28 v1.18"
  exit 1
fi

echo "Rolling back backend to: $BACKEND_VERSION"
echo "Rolling back frontend to: $FRONTEND_VERSION"

sed -i "s/^BACKEND_IMAGE_TAG=.*/BACKEND_IMAGE_TAG=$BACKEND_VERSION/" .env
sed -i "s/^FRONTEND_IMAGE_TAG=.*/FRONTEND_IMAGE_TAG=$FRONTEND_VERSION/" .env

docker-compose pull
docker-compose up -d
docker-compose ps

echo "Rollback complete."