var readline = require('readline');
var stdin = process.openStdin();
var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

 
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//listen on port 8081
server.listen(8081);


// routing .... mapping URLs to request handlers
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/readerClient.html');
});


// on connection, this server will simply dump data if any on console, to the client
io.sockets.on('connection', function (socket) {
rl.on('line', function (cmd) {
  socket.emit('p', cmd);
  console.log('You just typed: '+cmd);
});
});
