#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE bus_registration_system_database_development;
    CREATE DATABASE bus_registration_system_database_production;
EOSQL
