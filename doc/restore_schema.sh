#!/bin/sh -e
mydir=`dirname $0`
dropdb `cat $mydir/pgparams` --interactive jacksparrow
psql `cat $mydir/pgparams` -f $mydir/db-schema.sql
