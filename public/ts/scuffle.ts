window.onload = () => {
	var socket = io.connect('http://yellow.shockk.co.uk:1337')
	socket.emit('name', 'shockk')
	socket.on('hello', console.log.bind(console, 'Hello, %s!'))
	var game = new Scuffle.Game(socket)
}
