var fs = require('fs')
var net = require('net')

var app = require('http').createServer()
var io = require('socket.io').listen(app)
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

io.sockets.on('connection', socket => {
	socket.on('map.get', name => {
		var map = new Scuffle.Map(name)
		map.pushLine(new Scuffle.Line(
			new Scuffle.Point(100, 200),
			new Scuffle.Point(300, 500)
		))
		socket.emit('map', map)
	})
})
