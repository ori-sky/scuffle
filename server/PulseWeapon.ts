///<reference path="Weapon.ts"/>

module Scuffle {
	export class PulseWeapon extends Weapon {
		constructor(context : Client) {
			super(300, context)

			this.callback = () => {
				var bullet = context.instance.newBullet(context.player.id)
				var colors = [
					Color.Red, Color.Orange, Color.Yellow, Color.Green,
					Color.BrightBlue, Color.Magenta, Color.PurpleBlue, Color.PaleCyan
				]
				bullet.color = colors[Math.floor(Math.random() * colors.length)]
				var angle = context.player.angle// + (Math.random() - 0.5) / 10
				bullet.velocity.x = Math.cos(angle)
				bullet.velocity.y = Math.sin(angle)
				bullet.velocity.scale(0.7)
				bullet.pos.setToPoint(context.player.pos)
				bullet.pos.add(bullet.velocity.x * context.player.radius,
				               bullet.velocity.y * context.player.radius)
				bullet.radius = 2.5 / Math.min(1.5, Math.max(1, context.player.streak / 3))
				context.instance.forEachClient((cli : Client) => {
					cli.batch.push(Protocol.Server.InstanceBulletAdd, [bullet.compress(4)])
				})
			}
		}
	}
}
