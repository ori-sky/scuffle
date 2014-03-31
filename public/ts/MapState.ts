module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		mapName : string
		group : Phaser.Group

		init(name : string) {
			if(typeof name !== 'string')
				throw new TypeError('Scuffle.MapState#init(name)')
			this.mapName = name
		}

		preload() {
			this.group = this.add.group()
		}

		create() {

			this.game.socket.emit('map.get', this.mapName)
			this.game.socket.on('map.get', (map : Scuffle.Map) => {
				map.lines.forEach(line => {
					var group = this.add.group(this.group)
					group.alpha = 0
					this.add.tween(group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

					var graphics = this.add.graphics(0, 0, group)
					graphics.lineStyle(5, 0xffd900, 1)
					graphics.moveTo(line.a.x, line.a.y)
					graphics.lineTo(line.b.x, line.b.y)
				})
			})
		}
	}
}
