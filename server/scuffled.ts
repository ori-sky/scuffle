var fs = require('fs')
var opts = {
	key:  fs.readFileSync(__dirname + '/ssl/server.key'),
	cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
	ca:   fs.readFileSync(__dirname + '/ssl/ca.crt')
}
var app = require('https').createServer(opts)
var io = require('socket.io').listen(app)
app.listen(1337)

/*function handler(req : ServerRequest, res : ServerResponse)
{

}*/

io.sockets.on('connection', function(socket)
{
	console.log('connection received')
})
