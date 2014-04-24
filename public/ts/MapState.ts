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
		killMessages : Phaser.Group[]

		init(map : Scuffle.Map) {
			this.map = map
			this.players = {}
			this.bullets = {}
			this.killMessages = []
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
			this.lineOfSight.lineTo(60, 0)

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
				if(this.players[player.id] === undefined)
					this.players[player.id] = new ClientPlayer(player, g)
				else {
					this.players[player.id].graphics.destroy()
					this.players[player.id].player = player
					this.players[player.id].graphics = g
				}
			})
			this.game.socket.on('instance$player$you', (id : number) => {
				this.me = id
				this.players[id].state = this.game.localState
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
			this.game.socket.on(42, (id : number, name : string) => {
				if(this.players[id] !== undefined)
					this.players[id].state[name] = true
			})
			this.game.socket.on(43, (id : number, name : string) => {
				if(this.players[id] !== undefined)
					this.players[id].state[name] = false
			})
			this.game.socket.on(44, (id : number, pos : any) => {
				pos = Point.uncompress(pos)
				var cli = this.players[id]
				if(cli !== undefined) {
					var vDiff = Point.prototype.subtractedFromPoint.call(cli.player.pos, pos)
					var lenDiff = Point.prototype.length.call(vDiff)
					if(lenDiff > 40)
						cli.move(pos)
					else {
						var lenVel = Point.prototype.length.call(cli.player.velocity)
						vDiff.scale(Math.min(0.005, lenVel * this.game.latency))
						Point.prototype.addPoint.call(cli.player.velocity, vDiff)
					}
					if(id == this.me)
						this.camera.focusOnXY(cli.player.pos.x * this.group.scale.x, cli.player.pos.y * this.group.scale.y)
				}
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
				if(player.id == this.me)
					this.updateHealth()
			})
			this.game.socket.on('instance$player$hurt', (id : number, hp : number) => {
				this.players[id].player.health = hp
				if(id == this.me)
					this.updateHealth()
			})
			this.game.socket.on('instance$player$kill', (id : number, idKiller : number) => {
				var pl = this.players[id]
				pl.player.health = 0
				this.add.tween(pl.graphics).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)

				var grp = this.add.group()
				grp.fixedToCamera = true
				var tKilled = this.add.text(this.game.width - 10, 0, ' Player ' + id, undefined, grp)
				tKilled.anchor.x = 1
				tKilled.font = 'VT323'
				tKilled.fontSize = 30
				tKilled.fill = id == this.me ? '#fff' : '#bdf'
				tKilled.alpha = id == this.me ? 1 : 0.6
				var arrow = this.add.sprite(tKilled.x - tKilled.width, 0, 'bullet.arrow1', undefined, grp)
				arrow.scale.setTo(0.5, 0.5)
				arrow.anchor.x = 1
				arrow.alpha = idKiller == this.me ? 1 : 0.6
				var tKiller = this.add.text(arrow.x - arrow.width, 0, 'Player ' + idKiller + ' ', undefined, grp)
				tKiller.anchor.x = 1
				tKiller.font = 'VT323'
				tKiller.fontSize = 30
				tKiller.fill = idKiller == this.me ? '#fff' : '#bdf'
				tKiller.alpha = idKiller == this.me ? 1 : 0.6

				if(this.killMessages.length >= 3) {
					this.killMessages.shift().destroy(true)
					for(var i=0; i<this.killMessages.length; ++i) {
						this.killMessages[i].forEach(child => {
							child.y -= tKiller.height + 5
						}, this)
					}
				}
				this.killMessages.push(grp)

				var y = 10 + (tKiller.height + 5) * (this.killMessages.length - 1)
				grp.forEach(child => { child.y = y }, this)

				grp.alpha = 0
				var tw = this.add.tween(grp).to({ alpha: 1 }, 150, Phaser.Easing.Linear.None, true)
				tw.onComplete.add(() => {
					setTimeout(() => {
						var tw = this.add.tween(grp).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
						tw.onComplete.add(() => {
							grp.destroy(true)
							for(var i=0; i<this.killMessages.length; ++i) {
								if(this.killMessages[i] === grp) {
									this.killMessages.splice(i, 1)
									for(var j=i; j<this.killMessages.length; ++j) {
										this.killMessages[j].forEach(child => {
											child.y -= tKiller.height + 5
										}, this)
									}
									break
								}
							}
						})
					}, (id == this.me || idKiller == this.me) ? 6000 : 3000)
				})
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
			for(var id in this.players) {
				var cli = this.players[id]
				if(Player.prototype.isAlive.call(cli.player)) {
					if(tickPlayerMovement(time, cli.state, cli.player, this.map)) {
						cli.move(cli.player.pos)
						if(id == this.me)
							this.camera.focusOnXY(cli.player.pos.x * this.group.scale.x, cli.player.pos.y * this.group.scale.y)
					}
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

		updateHealth() {
			var pl = this.players[this.me].player
			var green = pl.health / pl.baseHealth * pl.radius * 4
			var red = pl.radius * 4 - green
			this.ownHealth.clear()
			this.ownHealth.beginFill(0x52ff52, 0.8)
			this.ownHealth.drawRect(-pl.radius * 2, pl.radius + 4, green, 2)
			this.ownHealth.endFill()
			this.ownHealth.beginFill(0xff5252, 0.8)
			this.ownHealth.drawRect(-pl.radius * 2 + green, pl.radius + 4, red, 2)
			this.ownHealth.endFill()
		}
	}
}
