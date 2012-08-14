#! /bin/bash/

if [ $1 ] && [ $2 ]  
then
	nginx -c $1 -p $2
else 
	echo "Filename and/or prefix-path missing"
fi
exit 0

#if nginx is not running then following script will start it with the config file localhost.conf ... assuming the file is in the current dir
# if already running, 
#$$> nginx -c localhost.conf -p /home/harsh/nginx_config/ -s reload
#nginx: [alert] could not open error log file: open() "/var/log/nginx/error.log" failed (13: Permission denied)
#2012/08/09 15:45:31 [notice] 7666#0: signal process started

