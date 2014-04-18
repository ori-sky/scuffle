module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		map : Scuffle.Map
		players : { [k : number] : ClientPlayer }
		bullets : { [k : number] : ClientBullet }
		me : number
		group : Phaser.Group
		lineOfSight : Phaser.Graphics

		init(map : Scuffle.Map) {
			this.map = map
			this.players = {}
			this.bullets = {}
		}

		create() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

			this.lineOfSight = this.add.graphics(0, 0, this.group)
			this.lineOfSight.alpha = 0
			this.lineOfSight.lineStyle(1, 0xaa0000, 1)
			this.lineOfSight.moveTo(0, 0)
			this.lineOfSight.lineTo(80, 0)

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
				g.beginFill(player.color, player.alpha)
				g.drawCircle(0, 0, player.radius)
				g.endFill()
				g.alpha = 0
				this.add.tween(g).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

				this.players[player.id] = new ClientPlayer(player, g)
			})
			this.game.socket.on('instance$player$you', (id : number) => {
				this.me = id
				this.lineOfSight.parent = this.players[id].graphics
				this.lineOfSight.alpha = 1
			})
			this.game.socket.on('instance$player$remove', (id : number) => {
				var p = this.players[id]
				this.add.tween(this.players[id].graphics)
					.to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true)
					.onComplete.add(() => p.destroy())
				delete this.players[id]
			})
			this.game.socket.on('instance$player$move', (id : number, pos : Point) => {
				this.players[id].move(pos)
			})
			this.game.socket.on('instance$bullet$add', (bullet : Bullet) => {
				var g = this.add.graphics(bullet.pos.x, bullet.pos.y, this.group)
				g.beginFill(bullet.color, bullet.alpha)
				g.drawCircle(0, 0, bullet.radius)
				g.endFill()
				this.bullets[bullet.id] = new ClientBullet(bullet, g)
			})
			this.game.socket.on('instance$bullet$remove', (id : number) => {
				this.bullets[id].destroy()
				delete this.bullets[id]
			})
			this.game.socket.on('instance$bullet$move', (id : number, pos : Point) => {
				this.bullets[id].move(pos)
			})
			this.game.socket.emit('instance$ready')

			var px, py
			this.input.mouse.mouseMoveCallback = e => {
				var mx = e.movementX || e.mozMovementX || e.webkitMovementX || (px ? e.layerX - px : 0)
				var my = e.movementY || e.mozMovementY || e.webkitMovementY || (py ? e.layerY - py : 0)
				px = e.layerX
				py = e.layerY
				this.lineOfSight.angle += (mx - my) * 2 / Math.PI
				// clamp angle to range 0:360
				this.lineOfSight.angle -= 360 * Math.floor(this.lineOfSight.angle / 360)
				this.game.socket.emit('instance$player$me$look', this.lineOfSight.angle * Math.PI / 180)
			}
		}

		shutdown() {
			this.input.mouse.mouseMoveCallback = undefined
			this.game.socket.removeAllListeners()
		}
	}
}
