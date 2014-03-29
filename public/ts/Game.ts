module Scuffle {
	export class Game extends Phaser.Game {
		socket : Socket

		constructor(socket) {
			super(1280, 720, Phaser.AUTO, 'content', null)

			this.socket = socket
			this.state.add('Boot', BootState, false)
			this.state.start('Boot')
		}
	}
}
