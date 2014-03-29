window.onload = () => {
	var socket = io.connect('https://yellow.shockk.co.uk:1337')
	socket.emit('name', 'shockk')
	socket.on('hello', (name : string) => {
		console.log('Hello, ' + name + '!')
	})
	var game = new Scuffle.Game(socket)
}
