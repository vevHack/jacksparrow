#!/bin/sh -e
dropdb `cat pgparams` --interactive jacksparrow
psql `cat pgparams` -f db-schema.sql
