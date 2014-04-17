module Scuffle {
	export class Bullet {
		id : number
		owner : number
		color : number
		radius : number
		pos : Point
		velocity : Point

		constructor(id : number, owner : number) {
			this.id = id
			this.owner = owner
			this.color = 0xffffff
			this.radius = 1
			this.pos = new Point(0, 0)
			this.velocity = new Point(0, 0)
		}
	}
}
