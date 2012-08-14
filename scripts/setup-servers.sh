#!/bin/sh -e

function checkBinary {
echo -n "checking for $1... "
if ! which $1; 
then
    echo
    echo "ERROR: $1 not found (hint: sudo apt-get install $1)"
    return
fi 
}

checkBinary nginx
checkBinary node
checkBinary npm

mkdir -p var/run
mkdir -p var/log

bash scripts/download-jetty.sh
