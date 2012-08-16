#!/bin/sh -e

function notify_start {
echo -n "starting socket.io server on port 8101, 8102, 8103... "
cd notify-server-socket.io && node server >../var/log/notify.log 2>&1 &
echo "done"
}

function notify_stop {
echo -n "stopping socket.io server... "
curl http://localhost:8109/ --silent 
echo "done"
}

case "$1" in
	start|stop)
		notify_${1}
		;;
	*)
		echo "Usage: $0 {start|stop}"
		exit 1
		;;
esac
exit 0
