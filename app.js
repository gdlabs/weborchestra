//requires
var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);


//express configuration
app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use('/public', express.static(__dirname + '/public'));
	app.use(app.router);
});

//routes
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/templates/index.html');
});


//socket config
//and logics

clients = [];

setInterval(function() {
	io.sockets.emit('refreshClientsList', clients);
}, 7500);

io.sockets.on('connection', function (socket) {

	socket.emit('yourId', { clientId: socket.id });
	
	socket.on('addMe', function (data) {
		for (client in clients){
			if (clients[client] == data){
				return;
			}
		}
		clients.push(data);
	});
	
	socket.on('broadcastTrack', function(data){
		socket.broadcast.emit('play', { trackId: data });
	});
	
	socket.on('disconnect', function () {
		//@todo: implementare controllo client disconnessi
	});

});


//finally, run
app.listen(80, '0.0.0.0');
