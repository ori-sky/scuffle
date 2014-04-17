module Scuffle {
	export class Client {
		game : ServerGame
		socket : any
		protocol : any = {
			state$on: (name : string) => this.state[name] = true,
			state$off: (name : string) => this.state[name] = false,
			map$get: (name : string) => this.socket.emit('map$get', this.game.maps[name]),
			instance$join: (id : string) => {
				this.instance = this.game.instances[parseInt(id)]
				this.socket.join(id)
				this.socket.emit('instance$join', id)
				this.socket.emit('instance$map$change', this.instance.map.name)
			},
			instance$ready: () => {
				if(this.instance !== undefined) {
					this.instance.newPlayer(this)
					this.socket.broadcast.to(this.instance.id).emit('instance$player$add', this.player)
					this.instance.forEachPlayer((player : Player) => {
						this.socket.emit('instance$player$add', player)
					})
					this.socket.emit('instance$player$you', this.player.id)
					this.instance.respawn(this.player.id)
				}
			},
			instance$player$me$look: (angle : number) => {
				this.player.angle = angle
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
		state : { [ k : string] : boolean }
		instance : Instance
		player : Player

		constructor(game : ServerGame, socket) {
			this.game = game
			this.socket = socket
			this.state = {}

			for(var fk in this.protocol) {
				var fv= this.protocol[fk]
				this.socket.on(fk, fv)
			}
		}

		tick(time : number) {
			this.tickMouse(time)
			this.tickMovement(time)
		}

		tickMouse(time : number) {
			if(this.state['mouse.left']) {
				var bullet = this.instance.newBullet(this.player.id)
				bullet.pos = Point.prototype.copy.call(this.player.pos)
				bullet.velocity.x = Math.cos(this.player.angle)
				bullet.velocity.y = Math.sin(this.player.angle)
				bullet.velocity.scale(5)
				this.game.io.sockets.in(this.instance.id).emit('instance$bullet$add', bullet)
			}
		}

		tickMovement(time : number) {
			var moveVector = new Point(0, 0)
			if(this.state['key.a'])
				moveVector.add(-1,  0)
			if(this.state['key.d'])
				moveVector.add( 1,  0)
			if(this.state['key.w'])
				moveVector.add( 0, -1)
			if(this.state['key.s'])
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
					intersects = this.instance.map.lines.some((l : Line) => {
						line = l
						return Line.prototype.intersectsLineOf.call(l, this.player.pos, newPos)
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
