module Scuffle {
	export class Client {
		game : ServerGame
		socket : any
		protocol : any = {
			// $ is used as separator due to being a valid identifier character
			state$on: (name : string) => this.state[name] = true,
			state$off: (name : string) => this.state[name] = false,
			map$get: (name : string) => this.socket.emit('map.get', this.game.maps[name]),
			instance$join: (id : string) => {
				this.instance = this.game.instances[parseInt(id)]
				this.socket.join(id)
				this.socket.emit('instance.join', id)
				this.socket.emit('instance.map.change', this.instance.map.name)
			},
			instance$ready: () => {
				if(this.instance !== undefined) {
					this.instance.newPlayer(this)
					this.socket.broadcast.to(this.instance.id).emit('instance.player.add', this.player)
					this.instance.forEach((client : Client) => {
						this.socket.emit('instance.player.add', client.player)
					})
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
		state : { [ k : string] : boolean }
		instance : Instance
		player : Player

		constructor(game : ServerGame, socket) {
			this.game = game
			this.socket = socket
			this.state = {}

			for(var fk in this.protocol) {
				var fv= this.protocol[fk]
				this.socket.on(fk.replace(/\$/g, '.'), fv)
			}
		}

		tick(time : number) {
			this.tickMovement(time)
		}

		tickMovement(time : number) {
			var moveVector = new Point(0, 0)
			if(this.state['key.left'])
				moveVector.add(-1,  0)
			if(this.state['key.right'])
				moveVector.add( 1,  0)
			if(this.state['key.up'])
				moveVector.add( 0, -1)
			if(this.state['key.down'])
				moveVector.add( 0,  1)

			if(!moveVector.isZero()) {
				moveVector.normalize()
				moveVector.scale(0.035 * time)
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
					this.game.io.sockets.in(this.instance.id).emit('instance.player.move',
									this.player.id, this.player.pos)
				}
			}
		}
	}
}
