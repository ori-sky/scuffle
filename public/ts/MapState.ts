module Scuffle {
	export class MapState extends Phaser.State {
		game : Game
		mapName : string

		init(name : string) {
			if(typeof name !== 'string')
				throw new TypeError('Scuffle.MapState#init(name)')
			this.mapName = name
		}

		preload() {

		}

		create() {
			var graphics = this.add.graphics(0, 0)
			graphics.lineStyle(5, 0xffd900, 1)

			this.game.socket.emit('map.get', this.mapName)
			this.game.socket.on('map', (map : Scuffle.Map) => {
				map.lines.forEach(line => {
					console.log(line)
					graphics.moveTo(line.a.x, line.a.y)
					graphics.lineTo(line.b.x, line.b.y)
				})
			})
		}
	}
}
