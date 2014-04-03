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
var state = {}
var idCounter = 0

io.sockets.on('connection', socket => {
	socket.on('state.on', name => state[name] = true)
	socket.on('state.off', name => state[name] = false)
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
		for(var id in players)
			socket.emit('player.add', players[id])
		socket.emit('player.you', idCounter.toString())
	})
	socket.on('player.moveBy', moveVector => {
		socket.get('id', (err, id) => {
			if(id !== null) {
				Scuffle.Point.prototype.add.call(players[id].pos, moveVector)
				socket.emit('player.move', [id, players[id].pos])
				socket.broadcast.emit('player.move', [id, players[id].pos])
			}
		})
	})
	socket.on('disconnect', () => {
		socket.get('id', (err, id) => {
			if(id !== null) {
				delete players[id]
				socket.broadcast.emit('player.remove', id)
			}
		})
	})
})
