module Scuffle {
	export class Player {
		id : number
		color : number
		alpha : number
		radius : number
		pos : Point
		velocity : Point
		angle : number

		constructor(id : number) {
			this.id = id
			this.color = 0xffffff
			this.alpha = 1
			this.radius = 7
			this.pos = new Point(0, 0)
			this.velocity = new Point(0, 0)
			this.angle = 0
		}
	}
}
