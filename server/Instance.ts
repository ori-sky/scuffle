module Scuffle {
	export class Instance {
		game : ServerGame
		id : number
		map : Map
		players : { [k : number] : Player }

		constructor(game : ServerGame, id : number) {
			this.game = game
			this.id = id
			this.players = {}
		}

		firstAvailableID() {
			for(var id=0; this.players[id]!==undefined; ++id) {}
			return id
		}

		forEach(fn : Function) {
			for(var k in this.players)
				fn(this.players[k], k, this.players)
		}

		newPlayer() {
			var id = this.firstAvailableID()
			return (this.players[id] = new Player(id))
		}

		removePlayer(id) {
			delete this.players[id]
		}

		respawn(id) {
			var spawnIndex = Math.floor(Math.random() * this.map.spawns.length)
			this.players[id].pos = this.map.spawns[spawnIndex]
			this.game.io.sockets.in(this.id).emit('instance.player.move', id, this.players[id].pos)
		}
	}
}
