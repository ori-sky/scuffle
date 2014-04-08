module Scuffle {
	export class Client {
		game : ServerGame
		socket : any
		protocol : any = {
			// $ is used as separator due to being a valid identifier character
			//socket.on('state.on', name => state[name] = true)
			//socket.on('state.off', name => state[name] = false)
			map$get: (name : string) => this.socket.emit('map.get', this.game.maps[name]),
			instance$join: (id : string) => {
				this.instance = this.game.instances[parseInt(id)]
				this.socket.join(id)
				this.socket.emit('instance.join', id)
				this.socket.emit('instance.map.change', this.instance.map.name)
			},
			instance$ready: () => {
				if(this.instance !== undefined) {
					this.player = this.instance.newPlayer()
					this.socket.broadcast.to(this.instance.id).emit('instance.player.add', this.player)
					this.instance.forEach(player => this.socket.emit('instance.player.add', player))
					this.socket.emit('instance.player.you', this.player.id)
					this.instance.respawn(this.player.id)
				}
			},
			disconnect: () => {
				if(this.instance !== undefined && this.player !== undefined) {
					this.socket.broadcast.to(this.instance.id).emit('instance.player.remove', this.player.id)
					this.instance.removePlayer(this.player.id)
					this.instance = undefined
					this.player = undefined
				}
			}
		}
		instance : Instance
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
