#!/bin/bash

set -e

BACKEND_VERSION=$1
FRONTEND_VERSION=$2
ACTIVE_FILE="deployment-history/active-environment.txt"
LOG_FILE="deployment-history/releases.log"
HEALTH_URL="https://digibab.com/"

if [ -z "$BACKEND_VERSION" ] || [ -z "$FRONTEND_VERSION" ]; then
  echo "Usage: ./scripts/promote-release.sh <backend-version> <frontend-version>"
  echo "Example: ./scripts/promote-release.sh v1.28 v1.18"
  exit 1
fi

ACTIVE_ENV=$(cat "$ACTIVE_FILE")

if [ "$ACTIVE_ENV" = "blue" ]; then
  TARGET_ENV="green"
elif [ "$ACTIVE_ENV" = "green" ]; then
  TARGET_ENV="blue"
else
  echo "Invalid active environment: $ACTIVE_ENV"
  exit 1
fi

echo "Active environment: $ACTIVE_ENV"
echo "Deploying new release to inactive environment: $TARGET_ENV"

sed -i "s/^BACKEND_IMAGE_TAG=.*/BACKEND_IMAGE_TAG=$BACKEND_VERSION/" .env
sed -i "s/^FRONTEND_IMAGE_TAG=.*/FRONTEND_IMAGE_TAG=$FRONTEND_VERSION/" .env

docker-compose -f docker-compose.$TARGET_ENV.yml pull
docker-compose -f docker-compose.$TARGET_ENV.yml up -d

echo "Waiting for $TARGET_ENV services..."
sleep 30

docker-compose exec backend-$TARGET_ENV curl -f http://localhost:8000/health/
docker-compose exec frontend-$TARGET_ENV curl -f http://localhost:3000

./scripts/switch-traffic.sh "$TARGET_ENV"

echo "$TARGET_ENV" > "$ACTIVE_FILE"

echo "$(date '+%Y-%m-%d %H:%M:%S') PROMOTE SUCCESS active=$TARGET_ENV previous=$ACTIVE_ENV backend=$BACKEND_VERSION frontend=$FRONTEND_VERSION" >> "$LOG_FILE"

curl -fsI "$HEALTH_URL" >/dev/null

echo "Promotion complete. Active environment is now: $TARGET_ENV"