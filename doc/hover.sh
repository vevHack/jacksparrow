#!/bin/bash -e
### Creating hover images from icons ###

export B=api-server-spring/src/main/webapp/static/img
export O=$B/original
export H=$B/hover
mkdir -p $H
function merge { convert $O/$1 $H/$1 -append $B/$1; }

f=stop.png eval \
    'convert $O/$f -modulate 110,0 -fill "#FF0022" -tint 100 $H/$f && merge $f'
f=check.png eval \
   'convert $O/$f -modulate 110,0 -fill "#00FF22" -tint 100 $H/$f && merge $f'
f=notepencil.png eval 'convert $O/$f -level 100%,0 $H/$f && merge $f'

rm -rf $H
