module Scuffle {
	export class ProtocolState extends Phaser.State {
		game : Game

		create() {
			this.game.socket.on('map.change', (mapName : string) => {
				this.game.socket.once('map.get', (map : Scuffle.Map) => {
					this.game.state.start('Map', true, false, map)
				})
				this.game.socket.emit('map.get', mapName)
			})
		}
	}
}
