module Scuffle {
	export class MapState extends Phaser.State {
		game : Game

		init(name : string) {
			if(typeof name !== 'string')
				throw new TypeError('Scuffle.MapState#init(name)')

			this.game.socket.emit('map.get', name)
			this.game.socket.on('map', (map : Scuffle.Map) => {
				console.log('name = %s', map.name)
				map.lines.forEach(line => {
					console.log(line)
				})
			})
		}

		preload() {

		}

		create() {

		}
	}
}
