window.onload = () => {
	var socket = io.connect('http://yellow.shockk.co.uk:1337')
	socket.on('disconnect', () => {
		io.connect('http://yellow.shockk.co.uk:1337')
	})
	var game = new Scuffle.Game(socket)
}
