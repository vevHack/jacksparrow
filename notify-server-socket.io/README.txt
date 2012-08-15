first of all install node, socket and express as per the links (both are same)...prefer the later one

http://chrislarson.me/content/chris-larson/beginners-guide-nodejs-socketio-and-express-framework-installation
http://psitsmike.com/2011/09/node-js-and-socket-io-chat-tutorial/

in order to install the latest versions include the following dependencies in the file package.json

-------------
package.json |
-------------
{
     "name": "chat",
     "description": "example chat application with socket.io",
     "version": "0.0.1",
     "dependencies": {
        "express": "3.x",
        "socket.io": "0.9.x"
     }
}


now the app can be run by 
$node <server.js>

and then access the client on the respective port

now to access database postgresql, pg is required ...
install it by using

$sudo npm install pg
