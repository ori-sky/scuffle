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
						bullet.velocity.x = Math.cos(this.player.angle)
						bullet.velocity.y = Math.sin(this.player.angle)
						bullet.velocity.scale(5)
						this.game.io.sockets.in(this.instance.id).emit('instance$bullet$add', bullet)
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
				moveVector.scale(0.025 * time)
				if(this.state['key.shift'])
					moveVector.scale(1 / 2)
				this.player.velocity.addPoint(moveVector)
			}

			if(!this.player.velocity.isZero()) {
				this.player.velocity.scale(1 - 0.011 * time)
				if(this.player.velocity.length() < 0.05)
					this.player.velocity.zero()

				var newPos : Point
				var intersects = true
				for(var i=0; intersects && i<5; ++i) {
					newPos = this.player.velocity.addedToPoint(this.player.pos)

					var line : Line
					intersects = this.instance.map.lines.some((ln : Line) => {
						line = ln
						return Line.prototype.intersectsCircleOf.call(ln, newPos, this.player.radius)
					})

					if(intersects) {
						var radians = Line.prototype.normal.call(line).angleTo(this.player.velocity)
						var length = this.player.velocity.length()
						this.player.velocity = Line.prototype.vector.call(line)
						this.player.velocity.normalizeTo(-Math.sin(radians) * length)
					}
				}

				if(!intersects) {
					this.player.pos = newPos
					this.game.io.sockets.in(this.instance.id).volatile.emit('instance$player$move',
									this.player.id, this.player.pos)
				}
			}
		}
	}
}
