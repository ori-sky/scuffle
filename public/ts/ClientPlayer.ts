module Scuffle {
	export class ClientPlayer {
		player : Player
		state : { [ k : string] : boolean }
		graphics : Phaser.Graphics
		isMe : boolean

		constructor(player : Player, graphics : Phaser.Graphics) {
			this.player = player
			this.graphics = graphics
			this.state = {}
			this.isMe = false
		}

		setPlayer(player : Player) {
			this.player = player
			this.move(player.pos)
			this.redraw()
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

		redraw() {
			this.graphics.clear()
			if(Player.prototype.isAlive.call(this.player)) {
				this.graphics.beginFill(this.player.color, this.player.alpha)
				this.graphics.drawCircle(0, 0, this.player.radius)
				this.graphics.endFill()
			}
		}

		destroy() {
			this.graphics.destroy()
		}
	}
}
