module Scuffle {
	export class ClientPlayer {
		player : Player
		sprite : Phaser.Sprite

		constructor(player : Player, sprite : Phaser.Sprite) {
			this.player = player
			this.sprite = sprite
		}

		move(pos : Point) {
			this.player.pos = pos
			this.sprite.reset(pos.x, pos.y)
		}
	}
}
