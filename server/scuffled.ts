var fs = require('fs')
var net = require('net')

var app = require('http').createServer()
var io = require('socket.io').listen(app)
//io.set('log level', 1)
app.listen(1337)

var opts = {
	key:  fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
	ca:   fs.readFileSync(__dirname + '/ssl/ca.crt')
}
require('tls').createServer(opts, stream => {
	var req = net.connect({ port: 1337, host: '127.0.0.1'}, () => {
		stream.pipe(req)
		req.pipe(stream)
	})
}).listen(1338)

var warehouse = JSON.parse(fs.readFileSync(__dirname + '/assets/warehouse.map.json'))
var players = {}
var idCounter = 0

io.sockets.on('connection', socket => {
	socket.on('map.change', socket.emit.bind(socket, 'map.change'))
	socket.on('map.get', name => {
		socket.emit('map.get', warehouse)
	})
	socket.on('map.ready', () => {
		var player = new Scuffle.Player((++idCounter).toString())
		var spawnIndex = Math.floor(Math.random() * warehouse.spawns.length)
		player.pos = warehouse.spawns[spawnIndex]
		players[player.id] = player

		socket.set('id', idCounter.toString())
		socket.broadcast.emit('player.add', player)
		socket.emit('player.add', player)
		for(var id in players)
			socket.emit('player.add', players[id])
		socket.emit('player.you', idCounter.toString())
		//socket.emit('player.move', [idCounter.toString(), {x:0,y:0}])
	})
})
