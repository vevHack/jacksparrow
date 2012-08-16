#!/bin/sh -e

function nginx_start {
echo -n "starting nginx on port 8080... "
cp nginx/jacksparrow.conf var
nginx -c jacksparrow.conf -p `readlink --canonicalize var`/
echo "done"
}

function nginx_stop {
echo -n "stopping nginx..."
nginx -c jacksparrow.conf -p `readlink --canonicalize var`/ -s stop
echo "done"
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
