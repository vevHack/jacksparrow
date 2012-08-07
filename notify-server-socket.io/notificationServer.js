var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use(express.bodyParser());

//maintain a list of client socket ids 
var clients={};
var list = ['harsh', 'akshay'];
var username;

//listen on port 8081
server.listen(8081);
console.log("Notification server using port 8081");
console.log("All the connections will be notified to others");

// routing .... mapping URLs to request handlers
app.get('/page', function (req, res) {
	//obtain sockets username	
	username=req.query.id || 'unknown';
	console.log("Request came from user "+username);
	res.sendfile(__dirname + '/notificationClient.html');
});

app.post('/notify', function(req, res) {
	if(req!=null) {	
		console.log("Received request from spring ... "+ JSON.stringify(req.headers));
		console.log(req.param("msg", "def"));
		res.write("success");
	}	
});



// on connection, this server will simply dump data if any on console, to the client
io.sockets.on('connection', function (socket) {
	//store the mapping
	
	clients[username] = socket;
	for (var index in list) {
		console.log("checking for "+list[index]);
		if(clients[list[index]]) {
			clients[list[index]].emit('userList',"NOTE");
		}
	}
});
