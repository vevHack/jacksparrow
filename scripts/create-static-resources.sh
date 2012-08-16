#!/bin/sh -e

www="var/www"
out="$www/static"

if [ -d $www ]; then
    echo "WARNING: $www already exists... proceeding nevertheless"
fi


mkdir -p $out

cp static/* $www
cp -r static/css $out
cp -r static/template $out

mkdir -p $out/js
mkdir -p $out/js/lib
for js in `find static/js -name '*.js'`; do
    echo "minifying `basename $js` ... "
    node_modules/.bin/uglifyjs $js >$www/${js}
done

mkdir -p $out/img
cp static/img/*.png $out/img
cp static/img/*.gif $out/img
bash scripts/create-sprites.sh

mkdir -p $www/html

function render { 
echo "rendering $1... "
node scripts/render.js <static/views/base.mustache >$www/html/$1.html $1;
}

render index
render unknownUser
render user
render post

