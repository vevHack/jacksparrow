#!/bin/sh -e

function nginx_start {
cp nginx/jacksparrow.conf var
nginx -c jacksparrow.conf -p `readlink --canonicalize var`/
}

function nginx_stop {
nginx -c jacksparrow.conf -p `readlink --canonicalize var`/ -s stop
}

case "$1" in
	start|stop)
		nginx_${1}
		;;
	*)
		echo "Usage: $0 {start|stop}"
		exit 1
		;;
esac
exit 0
