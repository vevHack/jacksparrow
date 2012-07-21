#!/bin/sh -e
### Getting external js (development versions) ###

libs=( \
    https://raw.github.com/janl/mustache.js/master/mustache.js \
    http://code.jquery.com/jquery-1.7.2.js \
    https://raw.github.com/jrburke/requirejs/master/require.js \
    https://raw.github.com/requirejs/text/master/text.js \
)


cd src/main/webapp/static/lib/
for lib in ${libs[@]}
do
    curl -O "$lib"
done
