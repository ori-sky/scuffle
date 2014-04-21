module Scuffle {
	export class ClientBullet {
		bullet : Bullet
		graphics : Phaser.Graphics

		constructor(bullet : Bullet, graphics : Phaser.Graphics) {
			this.bullet = bullet
			this.graphics = graphics
		}

		move(pos : Point) {
			this.bullet.pos = pos
			this.graphics.position.x = pos.x
			this.graphics.position.y = pos.y
		}

		moveBy(x : number, y : number) {
			this.bullet.pos.x += x
			this.bullet.pos.y += y
			this.graphics.position.x = this.bullet.pos.x
			this.graphics.position.y = this.bullet.pos.y
		}

		destroy() {
			this.graphics.destroy()
		}
	}
}
