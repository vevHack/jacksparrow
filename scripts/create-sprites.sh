#!/bin/bash -e
### Creating hover images from icons ###

export original=static/img/original
export out=var/www/static/img
export tmp=$out/hover

mkdir -p $tmp

function merge { convert $original/$1 $tmp/$1 -append $out/$1; }

function colorize { \
    convert $original/$1 -modulate 110,0 -fill $2 -tint 100 $tmp/$1 && merge $1;\
}

function whiten { convert $original/$1 -level 100%,0 $tmp/$1 && merge $1; }

red='#FF0022'
green='#00FF22'
blue='#2200FF'

colorize stop.png $red
colorize block.png $red

colorize check.png $green
colorize exchange.png $green

colorize slide.png $blue

whiten notepencil.png
whiten arrow.png
whiten questionbook.png
whiten cross.png

rm -rf $tmp
