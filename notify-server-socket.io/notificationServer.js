var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//maintain a list of client socket ids 
var clients={};
var users={};
var list = ['harsh', 'akshay'];
var username;

//listen on port 8081
server.listen(8081);
console.log("Notification server using port 8081");
console.log("All the connections will be notified to others");

// routing .... mapping URLs to request handlers
app.get('/page', function (req, res) {
	//obtain sockets username	
//	console.log("Request came ::" +JSON.stringify(req));	
	username=req.query.id;
	console.log("Request came from user "+username);
	res.sendfile(__dirname + '/notificationClient.html');
});


// on connection, this server will simply dump data if any on console, to the client
io.sockets.on('connection', function (socket) {
	//store the mapping
	
	users[username] = socket.id;
	clients[socket.id] = socket; 	

	for (var user in list) {
		if(users[user]) {
			clients[users[user]].emit('userList',JSON.stringify(users));
		}
	}
});
