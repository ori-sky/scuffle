var fs = require('fs')
var opts = {
	key:  fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
	ca:   fs.readFileSync(__dirname + '/ssl/ca.crt')
}
var app = require('https').createServer(opts)
var io = require('socket.io').listen(app)
app.listen(1337)

io.sockets.on('connection', socket => {
	socket.on('name', socket.emit.bind(socket, 'hello'))
})
