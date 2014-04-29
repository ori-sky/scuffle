///<reference path="Weapon.ts"/>

module Scuffle {
	export class CannonWeapon extends Weapon {
		constructor(context : Client) {
			super(1200, context)

			this.callback = () => {
				var bullet = context.instance.newBullet(context.player.id)
				var colors = [
					Color.Red, Color.Orange, Color.Yellow, Color.Green,
					Color.BrightBlue, Color.Magenta, Color.PurpleBlue, Color.PaleCyan
				]
				bullet.color = colors[Math.floor(Math.random() * colors.length)]
				var angle = context.player.angle
				bullet.velocity.x = Math.cos(angle)
				bullet.velocity.y = Math.sin(angle)
				bullet.velocity.scale(0.25)
				bullet.pos = Point.prototype.copy.call(context.player.pos)
				bullet.pos.add(bullet.velocity.x * context.player.radius,
				               bullet.velocity.y * context.player.radius)
				bullet.radius = 10
				bullet.damage = 50
				context.game.io.sockets.in(context.instance.id).emit(Protocol.Server.InstanceBulletAdd, bullet.compress(4))
			}
		}
	}
}
