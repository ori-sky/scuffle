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
				if(fn(this.clients[k], k, this.clients) === false)
					return false
			return true
		}

		forEachPlayer(fn : Function) {
			for(var k in this.clients)
				if(fn(this.clients[k].player, k, this.clients) === false)
					return false
			return true
		}

		forEachBullet(fn : Function) {
			for(var k in this.bullets)
				if(fn(this.bullets[k], k, this.bullets) === false)
					return false
			return true
		}

		newPlayer(client : Client) {
			var id = this.firstAvailablePlayerID()
			this.clients[id] = client
			this.clients[id].player = new Player(id)
			var colors = [
				0xff0000,
				0xff8800,
				0xffff00,
				0x00ff00,
				0x55aaff,
				0xff00ff,
				0x5500ff
			]
			this.clients[id].player.color = colors[Math.floor(Math.random() * colors.length)]
			return this.clients[id].player
		}

		removePlayer(id : number) {
			delete this.clients[id]
		}

		newBullet(owner : number) {
			var id = this.firstAvailableBulletID()
			return (this.bullets[id] = new Bullet(id, owner))
		}

		removeBullet(id : number) {
			this.game.io.sockets.in(this.id).emit('instance$bullet$remove', id)
			delete this.bullets[id]
		}

		respawn(id : number) {
			this.game.io.sockets.in(this.id).emit('instance$player$die', id)
			var spawnIndex = Math.floor(Math.random() * this.map.spawns.length)
			this.clients[id].player.pos = this.map.spawns[spawnIndex]
			this.clients[id].player.health = 100
			this.game.io.sockets.in(this.id).emit('instance$player$move', id, this.clients[id].player.pos)
		}

		tick(time : number) {
			this.forEachClient((client : Client) => {
				client.tick(time)
			})
			this.forEachBullet((bullet : Bullet, id : number) => {
				var newPos = bullet.velocity.addedToPoint(bullet.pos)
				var hitsWall = this.map.lines.some((ln : Line) => {
					return Line.prototype.intersectsLineOf.call(ln, bullet.pos, newPos)
				})
				if(hitsWall)
					this.removeBullet(id)
				else {
					var ln = new Line(bullet.pos, newPos)
					var hitsPlayer = false
					for(var idPl in this.clients) {
						var pl = this.clients[idPl].player
						// != used to coerce string and number
						if(idPl != bullet.owner)
							if(Line.prototype.intersectsCircleOf.call(ln, pl.pos, pl.radius)) {
								pl.health -= bullet.damage
								if(pl.health > 0)
									this.game.io.sockets.in(this.id).emit('instance$player$hurt', idPl)
								else
									this.respawn(idPl)
								this.removeBullet(id)
								hitsPlayer = true
								break
							}
					}

					if(!hitsPlayer) {
						bullet.pos = newPos
						this.game.io.sockets.in(this.id).volatile.emit('instance$bullet$move', id, bullet.pos)
					}
				}
			})
		}
	}
}
