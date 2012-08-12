#!/bin/bash -e
### Creating hover images from icons ###

export B=api-server-spring/src/main/webapp/static/img
export O=$B/original
export H=$B/hover
mkdir -p $H

function merge { convert $O/$1 $H/$1 -append $B/$1; }

function colorize { \
    convert $O/$1 -modulate 110,0 -fill $2 -tint 100 $H/$1 && merge $1;\
}

function whiten { convert $O/$1 -level 100%,0 $H/$1 && merge $1; }

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

rm -rf $H
