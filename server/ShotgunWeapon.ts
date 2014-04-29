///<reference path="Weapon.ts"/>

module Scuffle {
	export class ShotgunWeapon extends Weapon {
		constructor(context : Client) {
			super(750, context)

			this.callback = () => {
				var numBullets = 10
				var spread = 0.7
				var angle = context.player.angle - spread / 2
				for(var i=0; i<numBullets; ++i) {
					var bullet = context.instance.newBullet(context.player.id)
					var colors = [
						Color.Red, Color.Orange, Color.Yellow, Color.Green,
						Color.BrightBlue, Color.Magenta, Color.PurpleBlue, Color.PaleCyan
					]
					bullet.color = colors[Math.floor(Math.random() * colors.length)]
					var a = (Math.random() - 0.5) / 12
					if(Math.abs(a) > 0.038)
						a *= 10
					a += angle
					bullet.velocity.x = Math.cos(a)
					bullet.velocity.y = Math.sin(a)
					angle += spread / numBullets
					bullet.velocity.scale(0.6)
					bullet.pos = Point.prototype.copy.call(context.player.pos)
					bullet.pos.add(bullet.velocity.x * context.player.radius,
					bullet.velocity.y * context.player.radius)
					bullet.radius = 1
					bullet.damage = 10
					context.game.io.sockets.in(context.instance.id).emit(Protocol.Server.InstanceBulletAdd, bullet.compress(4))
				}
			}
		}
	}
}
