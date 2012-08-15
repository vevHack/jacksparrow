#!/bin/sh -e

function notify_start {
cd notify-server-socket.io && node server >../var/log/notify.log 2>&1 &
}

function notify_stop {
curl http://localhost:8109/ --silent 
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
