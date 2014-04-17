module Scuffle {
	export class Instance {
		game : ServerGame
		id : number
		map : Map
		clients : { [k : number] : Client }
		bullets : { [k : number] : Bullet }

		constructor(game : ServerGame, id : number) {
			this.game = game
			this.id = id
			this.clients = {}
			this.bullets = {}
		}

		firstAvailablePlayerID() {
			for(var id=0; this.clients[id]!==undefined; ++id) {}
			return id
		}

		firstAvailableBulletID() {
			for(var id=0; this.bullets[id]!==undefined; ++id) {}
			return id
		}

		forEachClient(fn : Function) {
			for(var k in this.clients)
				fn(this.clients[k], k, this.clients)
		}

		forEachPlayer(fn : Function) {
			for(var k in this.clients)
				fn(this.clients[k].player, k, this.clients)
		}

		forEachBullet(fn : Function) {
			for(var k in this.bullets)
				fn(this.bullets[k], k, this.bullets)
		}

		newPlayer(client : Client) {
			var id = this.firstAvailablePlayerID()
			this.clients[id] = client
			return (this.clients[id].player = new Player(id))
		}

		removePlayer(id : number) {
			delete this.clients[id]
		}

		newBullet(owner : number) {
			var id = this.firstAvailableBulletID()
			return (this.bullets[id] = new Bullet(id, owner))
		}

		removeBullet(id : number) {
			delete this.bullets[id]
		}

		respawn(id : number) {
			var spawnIndex = Math.floor(Math.random() * this.map.spawns.length)
			this.clients[id].player.pos = this.map.spawns[spawnIndex]
			this.game.io.sockets.in(this.id).emit('instance$player$move', id, this.clients[id].player.pos)
		}

		tick(time : number) {
			this.forEachClient((client : Client) => {
				client.tick(time)
			})
			this.forEachBullet((bullet : Bullet, id : number) => {
				var newPos = bullet.velocity.addedToPoint(bullet.pos)
				var hitsWall = this.map.lines.some((l : Line) => {
					return Line.prototype.intersectsLineOf.call(l, bullet.pos, newPos)
				})
				if(hitsWall) {
					this.game.io.sockets.in(this.id).emit('instance$bullet$remove', id)
					this.removeBullet(id)
				}
				else {
					bullet.pos = newPos
					this.game.io.sockets.in(this.id).volatile.emit('instance$bullet$move', id, bullet.pos)
				}
			})
		}
	}
}
