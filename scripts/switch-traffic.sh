#!/bin/bash

set -e

TARGET=$1

if [ "$TARGET" != "blue" ] && [ "$TARGET" != "green" ]; then
  echo "Usage: ./scripts/switch-traffic.sh [blue|green]"
  exit 1
fi

echo "Switching traffic to: $TARGET"

cat > infra/nginx/active-upstream.conf <<EOF
upstream frontend_upstream {
    server frontend-$TARGET:3000;
}

upstream backend_upstream {
    server backend-$TARGET:8000;
}
EOF

docker-compose exec nginx nginx -t

docker-compose exec nginx nginx -s reload

echo "Traffic switched to $TARGET successfully."

curl -I https://digibab.com/