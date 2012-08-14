#
# First cd to the dir in which you want to generate certificates.
# This location and certificates will be used in the config file for nginx
# The steps are taken from http://wiki.nginx.org/HttpSslModule and are 
#    compiled into a script file 
#


# Create the server private key, you'll be asked for a passphrase:
openssl genrsa -des3 -out server.key 1024

# Create the Certificate Signing Request (CSR):
openssl req -new -key server.key -out server.csr


# Remove the necessity of entering a passphrase for starting up nginx with SSL using the above private key:
cp server.key server.key.org
openssl rsa -in server.key.org -out server.key


# Finally sign the certificate using the above private key and CSR:
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# So we have files server.key and server.crt generated in the current dir 
# Fully qualified path has to be passed in the config file as shown below.
# Just three lines need to be added (the ones starting with the "ssl" )

#	server {
#	    server_name YOUR_DOMAINNAME_HERE;
#	    listen 443;
#	
#	    ssl on;
#	    ssl_certificate <path_to_certificate>/server.crt;
#	    ssl_certificate_key <path_to_key>/conf/server.key;
#
#	}
