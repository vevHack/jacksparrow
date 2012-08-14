#!/bin/sh -e

echo "packaging war ... "
cd api-server-spring/ && mvn package && cd ..

echo -n "copying war into jetty... "
bash scripts/jetty.sh load_war
echo "done"
