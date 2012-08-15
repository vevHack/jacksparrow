var httpPort = 8101;
var webSocketPort = 8102;
var stopPort = 8109;
var pgConnectionString = "pg://postgres:a@localhost/jacksparrow";

var pg = require('pg');	
var db = new pg.Client(pgConnectionString);
db.connect();

require('http').createServer(function (req, res) {
    process.exit(0);
}).listen(stopPort);

require('http').createServer(function (req, res) {
    onSpringNotification(req, res);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("OK\n");
}).listen(httpPort);

var io = require("socket.io").listen(webSocketPort);
io.set('log level', 1);
require("./nginxWorkaround").apply(io)

var tokenToSocket = {};
var socketIdToToken = {};

function getSocketById(id) {
    var clients = io.sockets.clients(),
    client = null;
    clients.forEach(function(_client) {
        if (_client.id === id) return (client = _client);
    });
    return client;
}

var url = require("url");
function parseParams(request) {
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var tokens = query.token;
    if (typeof tokens === "string") {
        tokens = [tokens];
    }
    return {tokens: tokens, type: query.type}
}

function onSpringNotification(req) {
    console.log("Received request from spring ... ");
    var params = parseParams(req);
    console.log(params);
    var tokensToNotify = params.tokens;
    console.log("Will notify "+ tokensToNotify.length);
    tokensToNotify.forEach(function(token) {
        var socket = tokenToSocket[token];
        if (typeof socket === "undefined") {
            console.log("Ignoring unknown token " + token);
        } else {
            console.log("sending event " + params.type + " on " + socket.id);
            try {
                socket.emit(params.type, "hello");
            } catch (ex) {}
		}
	});
};

    
io.sockets.on('connection', function (socket) {
    console.log("DEBUG: connection");
    socket.on("token", function (token) {
        console.log("DEBUG: token -");
        console.log(token);
        tokenToSocket[token] = socket;
        socketIdToToken[socket.id] = token;
		db.query("UPDATE session SET active=1 WHERE access_token = $1",
            [token], function (error, result) {
                console.log("DEBUG: db");
                console.log(arguments);
            });
    });
    socket.on("disconnect", function() {
		db.query("UPDATE session SET active=NULL WHERE access_token = $1",
            [socketIdToToken[socket.id]], function (error, result) {
                console.log("DEBUG: db");
                console.log(arguments);
            });
    });
});
