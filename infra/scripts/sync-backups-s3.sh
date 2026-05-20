#!/bin/bash

set -e

LOCAL_BACKUP_DIR="/home/ec2-user/DIGI2-PLATFORM/backups"
S3_BUCKET="s3://digi2-prod-backups-2026"

aws s3 sync "$LOCAL_BACKUP_DIR" "$S3_BUCKET" --delete

echo "S3 backup sync completed."