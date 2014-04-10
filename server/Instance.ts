module Scuffle {
	export class Instance {
		game : ServerGame
		id : number
		map : Map
		clients : { [k : number] : Client }

		constructor(game : ServerGame, id : number) {
			this.game = game
			this.id = id
			this.clients = {}
		}

		firstAvailableID() {
			for(var id=0; this.clients[id]!==undefined; ++id) {}
			return id
		}

		forEach(fn : Function) {
			for(var k in this.clients)
				fn(this.clients[k], k, this.clients)
		}

		forEachPlayer(fn : Function) {
			for(var k in this.clients)
				fn(this.clients[k].player, k, this.clients)
		}

		newPlayer(client : Client) {
			var id = this.firstAvailableID()
			this.clients[id] = client
			return (this.clients[id].player = new Player(id))
		}

		removePlayer(id) {
			delete this.clients[id]
		}

		respawn(id) {
			var spawnIndex = Math.floor(Math.random() * this.map.spawns.length)
			this.clients[id].player.pos = this.map.spawns[spawnIndex]
			this.game.io.sockets.in(this.id).emit('instance.player.move', id, this.clients[id].player.pos)
		}

		tick(time : number) {
			this.forEach((client : Client, id : number) => {
				var moveVector = new Point(0, 0)
				if(client.state['key.left'])
					moveVector.add(-1,  0)
				if(client.state['key.right'])
					moveVector.add( 1,  0)
				if(client.state['key.up'])
					moveVector.add( 0, -1)
				if(client.state['key.down'])
					moveVector.add( 0,  1)

				if(!moveVector.isZero()) {
					moveVector.normalize()
					moveVector.scale(0.03 * time)
					if(client.state['key.shift'])
						moveVector.scale(1 / 2)
					client.player.velocity.addPoint(moveVector)
				}

				if(!client.player.velocity.isZero()) {
					client.player.velocity.scale(1 - 0.012 * time)
					if(client.player.velocity.length() < 0.05)
						client.player.velocity.zero()

					Point.prototype.addPoint.call(client.player.pos, client.player.velocity)
					this.game.io.sockets.in(this.id).emit('instance.player.move', id, client.player.pos)
				}
			})
		}
	}
}
