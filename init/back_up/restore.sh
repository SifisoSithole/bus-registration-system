#!/bin/bash
if [ -f .env ]; then
    export $(cat .env | xargs)
    echo "Environment variables loaded from .env file"
    LATEST_BACKUP=$(gdrive files list --query "'$GDRIVE_PARENT_ID' in parents and trashed=false" --order-by "createdTime desc" --skip-header --max 1 | awk '{print $1}')
    if [ -z "$LATEST_BACKUP" ]; then
        echo "No backup files found in Google Drive."
        exit 1
    fi
    
    echo "Downloading the latest backup file: $LATEST_BACKUP"
    gdrive files download "$LATEST_BACKUP"
    BACKUP_FILE=$(gdrive files list --query "'$GDRIVE_PARENT_ID' in parents and trashed=false" --order-by "createdTime desc" --skip-header --max 1 | awk '{print $2}')
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Failed to download the backup file."
        exit 1
    fi

    DROP_TABLES_SQL="DO \$\$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END \$\$;"

    echo "$DROP_TABLES_SQL" | docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "bus_registration_system_database_development"
    zcat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "bus_registration_system_database_development"
    rm "$BACKUP_FILE"

    echo "Database restored successfully from $BACKUP_FILE."
fi

