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
			this.map.sprites.forEach(sprite => {
				var image : any = this.cache.getImage(sprite.source)
				var s = this.add.sprite(sprite.pos.x, sprite.pos.y, sprite.source, 0, this.group)
				s.scale.setTo(sprite.size.x / image.width, sprite.size.y / image.height)
			})
			this.map.lines.forEach(line => {
				var group = this.add.group(this.group)
				group.alpha = 0
				this.add.tween(group).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true)

				var graphics = this.add.graphics(0, 0, group)
				graphics.lineStyle(line.width || this.map.lineWidth || 2,
				                   line.color || this.map.lineColor || 0xffffff, 1)
				graphics.moveTo(line.a.x, line.a.y)
				graphics.lineTo(line.b.x, line.b.y)
			})
		}
	}
}
