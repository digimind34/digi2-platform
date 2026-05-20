#!/bin/bash

set -e

BACKUP_DIR="/home/ec2-user/DIGI2-PLATFORM/backups/media"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

mkdir -p "$BACKUP_DIR"

docker run --rm \
  -v digi2-platform_media_volume:/source:ro \
  -v $BACKUP_DIR:/backup \
  alpine \
  tar czf /backup/media_$TIMESTAMP.tar.gz -C /source .

find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +7 -delete

echo "Media backup completed: media_$TIMESTAMP.tar.gz"