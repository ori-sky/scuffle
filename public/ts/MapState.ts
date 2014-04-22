module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		map : Scuffle.Map
		players : { [k : number] : ClientPlayer }
		bullets : { [k : number] : ClientBullet }
		me : number
		group : Phaser.Group
		lineOfSight : Phaser.Graphics
		ownHealth : Phaser.Graphics

		init(map : Scuffle.Map) {
			this.map = map
			this.players = {}
			this.bullets = {}
		}

		create() {
			this.camera.bounds.x = -Infinity
			this.camera.bounds.y = -Infinity
			this.camera.bounds.width = Infinity
			this.camera.bounds.height = Infinity

			var btnLock = this.add.button(this.game.width - 48, this.game.height - 48, 'crosshair2', () => {
				this.input.mouse.requestPointerLock()
			})
			btnLock.scale.setTo(0.5, 0.5)
			btnLock.fixedToCamera = true
			btnLock.inputEnabled = true
			btnLock.input.useHandCursor = true
			btnLock.input.consumePointerEvent = true

			this.group = this.add.group()
			this.group.scale.setTo(2, 2)
			this.group.alpha = 0
			this.add.tween(this.group).to({alpha: 1}, 400, Phaser.Easing.Linear.None, true)

			this.lineOfSight = this.add.graphics(0, 0, this.group)
			this.lineOfSight.alpha = 0
			this.lineOfSight.lineStyle(1, 0xaa0000, 1)
			this.lineOfSight.moveTo(0, 0)
			this.lineOfSight.lineTo(80, 0)

			this.ownHealth = this.add.graphics(0, 0, this.group)

			this.map.sprites.forEach(sprite => {
				var image : any = this.cache.getImage(sprite.source)
				var s = this.add.sprite(sprite.pos.x, sprite.pos.y, sprite.source, 0, this.group)
				s.scale.setTo(sprite.size.x / image.width, sprite.size.y / image.height)
			})
			this.map.lines.forEach(line => {
				var graphics = this.add.graphics(0, 0, this.group)
				graphics.lineStyle(line.width || this.map.lineWidth || 2,
				                   parseInt(line.color) || parseInt(this.map.lineColor) || 0xffffff, 1)
				graphics.moveTo(line.a.x, line.a.y)
				graphics.lineTo(line.b.x, line.b.y)
			})

			this.game.socket.on('instance$player$add', (player : Player) => {
				var g = this.add.graphics(player.pos.x, player.pos.y, this.group)
				if(Player.prototype.isAlive.call(player)) {
					g.beginFill(player.color, player.alpha)
					g.drawCircle(0, 0, player.radius)
					g.endFill()
					g.alpha = 0
					this.add.tween(g).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)
				}
				this.players[player.id] = new ClientPlayer(player, g)
			})
			this.game.socket.on('instance$player$you', (id : number) => {
				this.me = id
				this.players[id].graphics.addChild(this.lineOfSight)
				this.players[id].graphics.addChild(this.ownHealth)
				this.lineOfSight.alpha = 1
			})
			this.game.socket.on('instance$player$remove', (id : number) => {
				var pl = this.players[id]
				this.add.tween(pl.graphics).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
					.onComplete.add(() => pl.destroy())
				delete this.players[id]
			})
			this.game.socket.on(44, (id : number, pos : any) => {
				pos = Point.uncompress(pos)
				var me = this.players[id]
				if(me !== undefined)
					if(id == this.me) {
						var vDiff = Point.prototype.subtractedFromPoint.call(me.player.pos, pos)
						vDiff.scale(0.3)
						me.moveByPoint(vDiff)
						this.camera.focusOnXY(me.player.pos.x * this.group.scale.x, me.player.pos.y * this.group.scale.y)
					}
					else
						this.players[id].move(pos)
			})
			this.game.socket.on('instance$player$spawn', (player : Player) => {
				var pl = this.players[player.id]
				var r = player.radius
				pl.player = player
				pl.move(player.pos)
				pl.graphics.clear()
				pl.graphics.beginFill(player.color, player.alpha)
				pl.graphics.drawCircle(0, 0, r)
				pl.graphics.endFill()
				pl.graphics.alpha = 0
				this.add.tween(pl.graphics).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)
				if(player.id == this.me) {
					this.camera.focusOnXY(player.pos.x * this.group.scale.x, player.pos.y * this.group.scale.y)
					this.ownHealth.clear()
					this.ownHealth.beginFill(0x52ff52, 0.8)
					this.ownHealth.drawRect(-r * 2, r + 4, r * 4, 2)
					this.ownHealth.endFill()
				}
			})
			this.game.socket.on('instance$player$hurt', (id : number, hp : number) => {
				if(id == this.me) {
					var r = this.players[id].player.radius
					var green = (hp / this.players[id].player.baseHealth) * r * 4
					var red = r * 4 - green
					console.log('%d/%d', hp, this.players[id].player.baseHealth)
					this.ownHealth.clear()
					this.ownHealth.beginFill(0x52ff52, 0.8)
					this.ownHealth.drawRect(-r * 2, r + 4, green, 2)
					this.ownHealth.endFill()
					this.ownHealth.beginFill(0xff5252, 0.8)
					this.ownHealth.drawRect(-r * 2 + green, r + 4, red, 2)
					this.ownHealth.endFill()
				}
			})
			this.game.socket.on('instance$player$kill', (id : number) => {
				var pl = this.players[id]
				pl.player.health = 0
				this.add.tween(pl.graphics).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
			})
			this.game.socket.on(50, (bullet : any) => {
				bullet = Bullet.uncompress(bullet)
				var g = this.add.graphics(bullet.pos.x, bullet.pos.y, this.group)
				g.beginFill(bullet.color, bullet.alpha)
				g.drawCircle(0, 0, bullet.radius)
				g.endFill()
				this.bullets[bullet.id] = new ClientBullet(bullet, g)
			})
			this.game.socket.on(52, (id : number) => {
				this.bullets[id].destroy()
				delete this.bullets[id]
			})
			this.game.socket.on('instance$bullet$move', (id : number, pos : any) => {
				this.bullets[id].move(Point.uncompress(pos))
			})
			this.game.socket.emit('instance$ready')

			var px = 0, py = 0
			var pmx = 0, pmy = 0
			this.input.mouse.mouseMoveCallback = e => {
				if(this.me === undefined)
					return

				var mx = e.movementX || e.mozMovementX || e.webkitMovementX || (px ? e.layerX - px : 0)
				var my = e.movementY || e.mozMovementY || e.webkitMovementY || (py ? e.layerY - py : 0)
				pmx = mx + pmx / 1.5
				pmy = my + pmy / 1.5
				px = e.layerX
				py = e.layerY

				if(this.input.mouse.locked) {
					var rad = this.lineOfSight.angle * Math.PI / 180
					var compX = -Math.sin(rad)
					var compY = Math.cos(rad)
					this.lineOfSight.angle += (pmx * compX + pmy * compY) / 3
					var radians = this.lineOfSight.angle * Math.PI / 180
				}
				else {
					var radians = Math.atan2(e.layerY - this.game.height / 2, e.layerX - this.game.width / 2)
					this.lineOfSight.angle = radians * 180 / Math.PI
				}

				// clamp angle to range 0:360
				this.lineOfSight.angle -= 360 * Math.floor(this.lineOfSight.angle / 360)
				this.game.socket.emit('instance$player$me$look', radians)
			}
		}

		update() {
			var time = this.game.time.elapsed
			var me = this.players[this.me]
			if(me !== undefined && Player.prototype.isAlive.call(me.player)) {
				if(tickPlayerMovement(time, this.game.syncState, me.player, this.map)) {
					me.move(me.player.pos)
					this.camera.focusOnXY(me.player.pos.x * this.group.scale.x, me.player.pos.y * this.group.scale.y)
				}
			}

			for(var k in this.bullets) {
				var vel = this.bullets[k].bullet.velocity.scaledBy(time)
				this.bullets[k].moveBy(vel.x, vel.y)
			}
		}

		shutdown() {
			this.camera.setBoundsToWorld()
			this.input.mouse.mouseMoveCallback = undefined
			this.game.socket.removeAllListeners()
		}
	}
}
