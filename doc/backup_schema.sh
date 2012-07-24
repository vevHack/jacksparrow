#!/bin/sh -e
mydir=`dirname $0`
pg_dump `cat $mydir/pgparams` --schema-only --create jacksparrow \
    >$mydir/db-schema.sql
