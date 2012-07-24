#!/bin/sh -e
pg_dump `cat pgparams` --schema-only --create jacksparrow >db-schema.sql
