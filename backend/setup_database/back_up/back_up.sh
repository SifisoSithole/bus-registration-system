#!/bin/bash

if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "Environment variables loaded from .env file"
    GDRIVE_FILE="database_backup_$(date +"%Y-%m-%d").sql.gz"
    docker exec -t "$CONTAINER_NAME" pg_dump -U "$POSTGRES_USER" "bus_registration_system_database_development" | gzip > "$GDRIVE_FILE"

    gdrive files upload --parent "$GDRIVE_PARENT_ID" "$GDRIVE_FILE"

    rm "$GDRIVE_FILE"
else
    echo "No .env file found"
fi


