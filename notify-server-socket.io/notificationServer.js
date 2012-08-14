var express = require('express');
var pg = require('pg');	
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//disable debug mode
io.set('log level', 1);

//use bodyParser for parsing the body of request
app.use(express.bodyParser());

//set connection string for postgres
var connectionString = "pg://postgres:a@localhost/postgres";

//create a client to make db queries
var client = new pg.Client(connectionString);
client.connect();


//maintain a list of client socket ids 
var connectedClients={};
var username;

//listen on port 8081
server.listen(8081);
console.log("Notification server using port 8081");
console.log("All the connections will be notified to others");

// routing .... mapping URLs to request handlers
app.get('/page', function (req, res) {
	if (req != null) {
		//obtain sockets username	
		username=req.query.id || 'unknown';
		console.log("Request came from user "+username);
		res.sendfile(__dirname + '/notificationClient.html');
	}
});

app.post('/notify', function(req, res) {
	if(req!=null) {	
		console.log("Received request from spring ... ");
		var listUsers = req.param("users", "[]");
		console.log("Received a list of users to be notified "+ listUsers);
		console.log("Sending notification to users now ...");
		for (var index in listUsers) {
			if(connectedClients[listUsers[index]]) {
				connectedClients[listUsers[index]].emit('userList',"more feeds available ... go get them");
			}				
		}
		res.write("success");
	}	
});


// on connection, this server will simply dump data if any on console, to the client
io.sockets.on('connection', function (socket) {
	//store the mapping
	if(!connectedClients[username]) {
		connectedClients[username] = socket;
		client.query("INSERT INTO pg_test VALUES($1, 1)",[username], function (error, result) {
			console.log("Added entry of user "+ username +" in list of connected clients");	
		});
	} else {
		connectedClients[username] = socket;
	}
	console.log("added a client ...\n");
});
