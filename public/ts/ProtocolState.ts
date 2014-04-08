module Scuffle {
	export class ProtocolState extends Phaser.State {
		game : Game

		create() {
			this.game.socket.on('instance.map.change', (mapName : string) => {
				this.game.socket.once('map.get', (map : Map) => {
					this.game.state.start('Map', true, false, map)
				})
				this.game.socket.emit('map.get', mapName)
			})
			this.game.socket.on('reset', () => {
				this.game.socket.disconnect()
				this.game.socket.socket.reconnect()
			})
			this.game.socket.on('refresh', () => {
				this.game.destroy()
				location.reload(true)
			})

			this.game.socket.emit('instance.join', 0)
		}
	}
}
