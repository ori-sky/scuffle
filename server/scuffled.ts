var app = require('http').createServer()
var io = require('socket.io').listen(app)
app.listen(1337)

/*function handler(req : ServerRequest, res : ServerResponse)
{

}*/

io.sockets.on('connection', function(socket)
{
	console.log('connection received')
})
