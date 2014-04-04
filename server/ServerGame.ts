module Scuffle {
	export class ServerGame {
		maps    : { [k : string] : Map }
		players : { [k : number] : Player }
		io : any

		constructor() {
			this.maps = {}
			this.players = {}
		}

		preload() {
			fs.readdirSync(__dirname + '/assets').filter((filename : string) =>
				filename.indexOf('.map.json', filename.length - '.map.json'.length) !== -1
			).forEach((filename : string) => {
				var contents = fs.readFileSync(__dirname + '/assets/' + filename)
				this.maps[filename.split('.')[0]] = JSON.parse(contents)
			})
		}

		protocol(io) {
			io.sockets.on('connection', socket => {
				//socket.on('state.on', name => state[name] = true)
				//socket.on('state.off', name => state[name] = false)
				socket.on('map.change', socket.emit.bind(socket, 'map.change'))
				socket.on('map.get', name => socket.emit('map.get', this.maps[name]))
				socket.on('map.ready', () => {
					for(var id=0; this.players[id]===undefined; ++id)
					var player = new Scuffle.Player(id.toString())
					var spawnIndex = Math.floor(Math.random() * this.maps['warehouse'].spawns.length)
					player.pos = this.maps['warehouse'].spawns[spawnIndex]
					this.players[player.id] = player

					socket.set('id', id)
					socket.broadcast.emit('player.add', player)
					for(var id in this.players)
						socket.emit('player.add', this.players[id])
					socket.emit('player.you', id)
				})
				socket.on('disconnect', () => {
					socket.get('id', (err, id) => {
						if(id !== null) {
							delete this.players[id]
							socket.broadcast.emit('player.remove', id)
						}
					})
				})
			})
			this.io = io
		}

		start(io) {
			this.preload()
			this.protocol(io)
		}
	}
}
