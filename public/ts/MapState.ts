module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		map : Scuffle.Map
		group : Phaser.Group

		init(map : Scuffle.Map) {
			this.map = map
		}

		preload() {
			this.group = this.add.group()
		}

		create() {
			this.map.lines.forEach(line => {
				var group = this.add.group(this.group)
				group.alpha = 0
				this.add.tween(group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

				var graphics = this.add.graphics(0, 0, group)
				graphics.lineStyle(5, 0xffd900, 1)
				graphics.moveTo(line.a.x, line.a.y)
				graphics.lineTo(line.b.x, line.b.y)
			})
		}
	}
}
