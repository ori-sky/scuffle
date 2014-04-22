module Scuffle {
	export class Client {
		game : ServerGame
		socket : any
		protocol : any = {
			state$on: (name : string) => this.state[name] = true,
			state$off: (name : string) => this.state[name] = false,
			map$get: (name : string) => {
				if(this.game.maps[name] !== undefined)
					this.socket.emit('map$get', this.game.maps[name])
				else
					this.socket.emit('map$notfound', name)
			},
			instance$join: (id : number) => {
				if(this.instance === undefined)
					if(this.game.instances[id] !== undefined) {
						this.instance = this.game.instances[id]
						this.socket.join(id)
						this.socket.emit('instance$join', id)
						this.socket.emit('instance$map$change', this.instance.map.name)
					}
					else
						this.socket.emit('instance$notfound', id)
				else
					this.socket.emit('instance$in', this.instance.id)
			},
			instance$ready: () => {
				if(this.instance !== undefined) {
					this.instance.newPlayer(this)
					this.socket.broadcast.to(this.instance.id).emit('instance$player$add', this.player)
					this.instance.forEachPlayer((player : Player) => {
						this.socket.emit('instance$player$add', player)
					})
					this.socket.emit('instance$player$you', this.player.id)
					this.instance.spawn(this.player.id)
				}
				else
					this.socket.emit('instance$none')
			},
			instance$player$me$look: (angle : number) => {
				if(this.instance !== undefined)
					this.player.angle = angle
				else
					this.socket.emit('instance$none')
			},
			disconnect: () => {
				if(this.instance !== undefined && this.player !== undefined) {
					this.socket.broadcast.to(this.instance.id).emit('instance$player$remove', this.player.id)
					this.instance.removePlayer(this.player.id)
					this.instance = undefined
					this.player = undefined
				}
			}
		}
		instance : Instance
		player : Player
		state : { [ k : string] : boolean }
		accumBullet : number

		constructor(game : ServerGame, socket) {
			this.game = game
			this.socket = socket
			this.state = {}
			this.accumBullet = 0

			for(var fk in this.protocol) {
				var fv= this.protocol[fk]
				this.socket.on(fk, fv)
			}
		}

		tick(time : number) {
			this.tickMouse(time)
			if(this.player.isAlive())
				this.tickMovement(time)
		}

		tickMouse(time : number) {
			this.accumBullet += time
			if(this.player.isAlive())
				if(this.state['mouse.left'])
					if(this.accumBullet >= 150) {
						var bullet = this.instance.newBullet(this.player.id)
						var colors = [
							0xff0000,
							0xff8800,
							0xffff00,
							0x00ff00,
							0x55aaff,
							0xff00ff,
							0x5500ff,
							0xaaccff
						]
						bullet.color = colors[Math.floor(Math.random() * colors.length)]
						bullet.pos = Point.prototype.copy.call(this.player.pos)
						var angle = this.player.angle// + (Math.random() - 0.5) / 10
						bullet.velocity.x = Math.cos(angle)
						bullet.velocity.y = Math.sin(angle)
						bullet.velocity.scale(0.5)
						this.game.io.sockets.in(this.instance.id).emit(50, bullet.compress(4))
						this.accumBullet = 0
					}
		}

		tickMovement(time : number) {
			var moveVector = new Point(0, 0)
			if(this.state['key.a'] || this.state['key.left'])
				moveVector.add(-1,  0)
			if(this.state['key.d'] || this.state['key.right'])
				moveVector.add( 1,  0)
			if(this.state['key.w'] || this.state['key.up'])
				moveVector.add( 0, -1)
			if(this.state['key.s'] || this.state['key.down'])
				moveVector.add( 0,  1)

			if(!moveVector.isZero()) {
				moveVector.normalize()
				moveVector.scale(0.0025 * time)
				if(this.state['key.shift'])
					moveVector.scale(1 / 2)
				this.player.velocity.addPoint(moveVector)
			}

			if(!this.player.velocity.isZero()) {
				this.player.velocity.scale(1 - 0.011 * time)
				if(this.player.velocity.length() < 0.005)
					this.player.velocity.zero()

				var newPos : Point
				var intersects = true
				for(var i=0; intersects && i<5; ++i) {
					newPos = Point.prototype.addedToPoint.call(this.player.pos, this.player.velocity.scaledBy(time))

					intersects = false
					this.instance.map.lines.every((ln : Line) => {
						if(Line.prototype.intersectsMovingCircleOf.call(ln, this.player.pos, newPos, this.player.radius)) {
							intersects = true
							var normal = Line.prototype.normal.call(ln)
							var radians = normal.angleTo(this.player.velocity)
							var len = this.player.velocity.length()
							this.player.velocity = Line.prototype.vector.call(ln)
							this.player.velocity.normalizeTo(-Math.sin(radians) * len)
							return false
						}
						else
							return true
					})
				}

				if(!intersects) {
					this.player.pos = newPos
					this.game.io.sockets.in(this.instance.id).volatile.emit(44, this.player.id,
									Point.prototype.compress.call(this.player.pos, 3))
				}
			}
		}
	}
}
