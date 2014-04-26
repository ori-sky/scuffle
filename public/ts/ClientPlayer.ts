module Scuffle {
	export class ClientPlayer {
		player : Player
		state : { [ k : string] : boolean }
		graphics : Phaser.Graphics
		gScores : Phaser.Group
		tName : Phaser.Text
		tKills : Phaser.Text
		tStreak : Phaser.Text
		tDeaths : Phaser.Text

		constructor(player : Player, graphics : Phaser.Graphics) {
			this.player = player
			this.graphics = graphics
			this.state = {}
		}

		move(pos : Point) {
			this.player.pos = pos
			this.graphics.position.x = pos.x
			this.graphics.position.y = pos.y
		}

		moveBy(x : number, y : number) {
			this.player.pos.x += x
			this.player.pos.y += y
			this.graphics.position.x = this.player.pos.x
			this.graphics.position.y = this.player.pos.y
		}

		moveByPoint(p : Point) {
			this.moveBy(p.x, p.y)
		}

		destroy() {
			this.graphics.destroy()
		}
	}
}
