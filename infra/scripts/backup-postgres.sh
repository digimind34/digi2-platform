#!/bin/bash

set -e

BACKUP_DIR="/home/ec2-user/DIGI2-PLATFORM/backups/postgres"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/digi2_db_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

docker exec digi2-db pg_dump -U digi2_user -d digi2 > "$BACKUP_FILE"

gzip "$BACKUP_FILE"

find "$BACKUP_DIR" -type f -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"