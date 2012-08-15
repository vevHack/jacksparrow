var httpPort = 8101;
var webSocketPort = 8102;
var pgConnectionString = "pg://postgres:a@localhost/postgres";

var pg = require('pg');	
var db = new pg.Client(pgConnectionString);
db.connect();

require('http').createServer(function (req, res) {
    onSpringNotification(req, res);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("");
}).listen(httpPort);

var io = require("socket.io").listen(webSocketPort);
//io.set('log level', 1);
require("./nginxWorkaround").apply(io)

var tokenToSocket = {};

function onSpringNotification(req) {
/*
    console.log("Received request from spring ... ");
    var tokensToNotify = req.param("token", "[]");
    console.log("Will notify "+ tokensToNotify.length);
    tokensToNotify.forEach(function(token) {
        var socket = tokenToSocket[token];
        if (socket) {
            console.log("Ignoring unknown token " + token);
        } else {
            socket.emit("feed");
		}
	});
    */
    onDebugHttpConnect();
};

var g_socket;
function onDebugHttpConnect(req) {
    //console.log(req);
    console.log("spring connect");
    g_socket.emit("feed");
}

    
io.sockets.on('connection', function (socket) {
/*
	if(!connectedClients[username]) {
		connectedClients[username] = socket;
		client.query("UPDATE session SET active=1 WHERE access_token = $1",[username], function (error, result) {
			console.log("Added entry of user "+ username +" in list of connected clients");	
		});
	} else {
		connectedClients[username] = socket;
	}
	console.log("added a client ...\n");
    */
    console.log("DEBUG: connection");
    //console.log(socket);
//    g_socket = socket;

     socket.emit('feed', { hello: 'world' });
     socket.on('my other event', function (data) {
         console.log(data);
     });
});

io.sockets.on('42', function (socket) {
    console.log("DEBUG: event 42");
    //console.log(socket);
});
