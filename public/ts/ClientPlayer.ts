module Scuffle {
	export class ClientPlayer {
		player : Player
		graphics : Phaser.Graphics

		constructor(player : Player, graphics : Phaser.Graphics) {
			this.player = player
			this.graphics = graphics
		}

		move(pos : Point) {
			this.player.pos = pos
			this.graphics.position.x = pos.x
			this.graphics.position.y = pos.y
		}

		destroy() {
			this.graphics.destroy()
		}
	}
}
