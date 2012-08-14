#!/bin/sh -e

JETTY_VERSION=8.1.5.v20120716
TGZ="jetty-distribution-$JETTY_VERSION.tar.gz"
JETTY_HOME="var/jetty-distribution-$JETTY_VERSION"

STOP_KEY=42
PORT_BASE=808
STOP_PORT_BASE=809

function jetty_download {
cd var
if [ -f $TGZ ]; then
    echo "$TGZ found, skipping download"
else
    echo "$TGZ not found, downloading..."
    wget http://download.eclipse.org/jetty/$JETTY_VERSION/dist/$TGZ
fi
tar xfz $TGZ
# cd .. &&  cd $JETTY_HOME rm webapps/*
}

function jetty_load_war {
cp api-server-spring/target/jacksparrow-spring.war $JETTY_HOME/webapps/root.war
}

function jetty_start {
cd $JETTY_HOME
echo -n "starting jetty on port ${PORT_BASE}$1..."
java -jar start.jar jetty.port=${PORT_BASE}$1 \
    STOP.PORT=${STOP_PORT_BASE}$1 STOP.KEY=$STOP_KEY --daemon &
echo "done"
}

function jetty_stop {
cd $JETTY_HOME
echo -n "stopping jetty instance running on port ${PORT_BASE}$1..."
java -jar start.jar STOP.PORT=${STOP_PORT_BASE}$1 STOP.KEY=$STOP_KEY --stop
echo "done"
}

case "$1" in
	start|stop)
		jetty_${1} ${2}
		;;
    load_war|download)
        jetty_${1}
		;;
	*)
		echo "Usage: $0 {start|stop|download|load_war}"
		exit 1
		;;
esac
exit 0
