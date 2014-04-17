module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		group : Phaser.Group
		map : Scuffle.Map
		players : { [k : number] : ClientPlayer }
		bullets : { [k : number] : ClientBullet }
		me : number
		lineOfSight : Phaser.Graphics
		lineOfSightG : Phaser.Group

		init(map : Scuffle.Map) {
			this.map = map
			this.players = {}
			this.bullets = {}
		}

		preload() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

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
		}

		create() {
			this.lineOfSightG = this.add.group(this.group)
			this.lineOfSightG.alpha = 0
			this.lineOfSight = this.add.graphics(0, 0, this.lineOfSightG)
			this.lineOfSight.lineStyle(1, 0xff2222, 1)
			this.lineOfSight.moveTo(0, 0)
			this.lineOfSight.lineTo(80, 0)

			this.game.socket.on('instance$player$add', (player : Player) => {
				var group = this.add.group(this.group)
				group.alpha = 0
				this.add.tween(group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

				var s = this.add.sprite(player.pos.x, player.pos.y, 'phaser2logo', 0, group)
				s.anchor.setTo(0.5, 0.5)
				s.scale.setTo(0.05, 0.05)

				this.players[player.id] = new ClientPlayer(player, s)
			})
			this.game.socket.on('instance$player$you', (id : number) => {
				this.me = id
				this.lineOfSightG.alpha = 1
				this.lineOfSight.position.x = this.players[id].sprite.position.x
				this.lineOfSight.position.y = this.players[id].sprite.position.y
			})
			this.game.socket.on('instance$player$remove', (id : number) => {
				var tween = this.add.tween(this.players[id].sprite).to({ alpha: 0 },
						400, Phaser.Easing.Linear.None, true)
				var p = this.players[id]
				tween.onComplete.add(() => p.destroy())
				delete this.players[id]
			})
			this.game.socket.on('instance$player$move', (id : number, pos : Point) => {
				if(this.players[id] !== undefined) {
					this.players[id].move(pos)
					if(id === this.me) {
						this.lineOfSight.position.x = pos.x
						this.lineOfSight.position.y = pos.y
					}
				}
			})
			this.game.socket.on('instance$bullet$add', (bullet : Bullet) => {
				var g = this.add.graphics(bullet.pos.x, bullet.pos.y, this.group)
				g.beginFill(0x00ff00, 0.8)
				g.drawCircle(0, 0, bullet.radius)
				g.endFill()
				this.bullets[bullet.id] = new ClientBullet(bullet, g)
			})
			this.game.socket.on('instance$bullet$remove', (id : number) => {
				this.bullets[id].destroy()
				delete this.bullets[id]
			})
			this.game.socket.on('instance$bullet$move', (id : number, pos : Point) => {
				if(this.bullets[id] !== undefined) {
					this.bullets[id].move(pos)
				}
			})
			this.game.socket.emit('instance$ready')

			var cursorKeys = this.game.input.keyboard.createCursorKeys()
			var kShift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
			var kW = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
			var kA = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
			var kS = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
			var kD = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
			cursorKeys.left .onDown.add(() => this.game.socket.emit('state$on', 'key.left'))
			cursorKeys.right.onDown.add(() => this.game.socket.emit('state$on', 'key.right'))
			cursorKeys.up   .onDown.add(() => this.game.socket.emit('state$on', 'key.up'))
			cursorKeys.down .onDown.add(() => this.game.socket.emit('state$on', 'key.down'))
			kShift.onDown.add(() => this.game.socket.emit('state$on', 'key.shift'))
			kW.onDown.add(() => this.game.socket.emit('state$on', 'key.w'))
			kA.onDown.add(() => this.game.socket.emit('state$on', 'key.a'))
			kS.onDown.add(() => this.game.socket.emit('state$on', 'key.s'))
			kD.onDown.add(() => this.game.socket.emit('state$on', 'key.d'))
			cursorKeys.left .onUp.add(() => this.game.socket.emit('state$off', 'key.left'))
			cursorKeys.right.onUp.add(() => this.game.socket.emit('state$off', 'key.right'))
			cursorKeys.up   .onUp.add(() => this.game.socket.emit('state$off', 'key.up'))
			cursorKeys.down .onUp.add(() => this.game.socket.emit('state$off', 'key.down'))
			kShift.onUp.add(() => this.game.socket.emit('state$off', 'key.shift'))
			kW.onUp.add(() => this.game.socket.emit('state$off', 'key.w'))
			kA.onUp.add(() => this.game.socket.emit('state$off', 'key.a'))
			kS.onUp.add(() => this.game.socket.emit('state$off', 'key.s'))
			kD.onUp.add(() => this.game.socket.emit('state$off', 'key.d'))

			this.input.mouse.mouseDownCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit('state$on', 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit('state$on', 'mouse.right')
						break
				}
				this.input.mouse.requestPointerLock()
			}
			this.input.mouse.mouseUpCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit('state$off', 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit('state$off', 'mouse.right')
						break
				}
			}
			var px, py
			this.input.mouse.mouseMoveCallback = e => {
				var mx = e.movementX || e.mozMovementX || e.webkitMovementX
					|| (px !== undefined ? e.layerX - px : 0)
				var my = e.movementY || e.mozMovementY || e.webkitMovementY
					|| (py !== undefined ? e.layerY - py : 0)
				px = e.layerX
				py = e.layerY
				this.lineOfSight.angle += (mx - my) * 2 / Math.PI
				// clamp angle to range 0:360
				this.lineOfSight.angle -= 360 * Math.floor(this.lineOfSight.angle / 360)
				this.game.socket.emit('instance$player$me$look', this.lineOfSight.angle * Math.PI / 180)
			}
		}

		update() {

		}

		shutdown() {
			this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.UP)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SHIFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.W)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.A)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.S)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.D)
			this.input.mouse.mouseDownCallback = undefined
			this.input.mouse.mouseUpCallback = undefined
			this.input.mouse.mouseMoveCallback = undefined
			this.input.mouse.releasePointerLock()
			this.game.socket.removeAllListeners('instance$player$add')
			this.game.socket.removeAllListeners('instance$player$remove')
			this.game.socket.removeAllListeners('instance$player$move')
			this.game.socket.removeAllListeners('instance$player$you')
			this.game.socket.removeAllListeners('instance$bullet$add')
			this.game.socket.removeAllListeners('instance$bullet$remove')
			this.game.socket.removeAllListeners('instance$bullet$move')
		}
	}
}
