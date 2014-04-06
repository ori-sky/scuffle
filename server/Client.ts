module Scuffle {
	export class Client {
		game : ServerGame
		socket : any
		protocol : any = {
			// $ is used as separator due to being a valid identifier character
			//socket.on('state.on', name => state[name] = true)
			//socket.on('state.off', name => state[name] = false)
			map$change: (name : string) => {
				this.map = name
				this.socket.emit('map.change', name)
			},
			map$get: (name : string) => this.socket.emit('map.get', this.game.maps[name]),
			map$ready: () => {
				if(this.map !== undefined) {
					this.player = new Scuffle.Player(this.game.firstAvailableID().toString())
					this.game.players[this.player.id] = this.player

					var spawnIndex = Math.floor(Math.random() * this.game.maps[this.map].spawns.length)
					this.player.pos = this.game.maps[this.map].spawns[spawnIndex]

					this.socket.broadcast.emit('player.add', this.player)
					for(var id in this.game.players)
						this.socket.emit('player.add', this.game.players[id])
					this.socket.emit('player.you', this.player.id)
				}
			},
			disconnect: () => {
				if(this.player !== undefined) {
					this.socket.broadcast.emit('player.remove', this.player.id)
					delete this.game.players[this.player.id]
					delete this.player
				}
			}
		}
		map : string
		player : Player

		constructor(game : ServerGame, socket) {
			this.game = game
			this.socket = socket

			for(var fk in this.protocol) {
				var fv= this.protocol[fk]
				this.socket.on(fk.replace(/\$/g, '.'), fv)
			}
		}
	}
}
