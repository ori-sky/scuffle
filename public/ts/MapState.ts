module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		group : Phaser.Group
		cursorKeys : any
		map : Scuffle.Map
		players : any

		init(map : Scuffle.Map) {
			this.map = map
			this.players = {}
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
			this.game.socket.on('instance.player.add', (player : Player) => {
				var group = this.add.group(this.group)
				group.alpha = 0
				this.add.tween(group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

				var s = this.add.sprite(player.pos.x, player.pos.y, 'phaser2logo', 0, group)
				s.anchor.setTo(0.5, 0.5)
				s.scale.setTo(0.05, 0.05)

				this.players[player.id] = new ClientPlayer(player, s)
			})
			this.game.socket.on('instance.player.remove', (id : string) => {
				var tween = this.add.tween(this.players[id].sprite).to({ alpha: 0 },
						400, Phaser.Easing.Linear.None, true)
				var p = this.players[id]
				tween.onComplete.add(() => p.destroy())
				delete this.players[id]
			})
			this.game.socket.on('instance.player.move', (id : string, pos : Point) => {
				if(this.players[id] !== undefined)
					this.players[id].move(pos)
			})
			this.game.socket.emit('instance.ready')

			this.cursorKeys = this.game.input.keyboard.createCursorKeys()
			this.cursorKeys.left .onDown.add(() => this.game.socket.emit('state.on', 'key.left'))
			this.cursorKeys.right.onDown.add(() => this.game.socket.emit('state.on', 'key.right'))
			this.cursorKeys.up   .onDown.add(() => this.game.socket.emit('state.on', 'key.up'))
			this.cursorKeys.down .onDown.add(() => this.game.socket.emit('state.on', 'key.down'))
			this.cursorKeys.left. onUp.add  (() => this.game.socket.emit('state.off', 'key.left'))
			this.cursorKeys.right.onUp.add  (() => this.game.socket.emit('state.off', 'key.right'))
			this.cursorKeys.up   .onUp.add  (() => this.game.socket.emit('state.off', 'key.up'))
			this.cursorKeys.down .onUp.add  (() => this.game.socket.emit('state.off', 'key.down'))
		}

		update() {

		}

		shutdown() {
			this.game.socket.removeAllListeners('player.add')
			this.game.socket.removeAllListeners('player.remove')
			this.game.socket.removeAllListeners('player.move')
			this.game.socket.removeAllListeners('player.you')
		}
	}
}
