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

		destroy() {
			this.graphics.destroy()
		}
	}
}
