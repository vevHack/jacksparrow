#!/bin/sh -e

if ! which nginx; 
then 
    echo "ERROR: nginx not found (hint: sudo apt-get install nginx)"
    return
fi

mkdir -p var/run
mkdir -p var/log
