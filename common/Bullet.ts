module Scuffle {
	export class Bullet {
		id : number
		owner : number
		pos : Point
		radius : number

		constructor(id : number, owner : number) {
			this.id = id
			this.owner = owner
			this.pos = new Point(0, 0)
			this.radius = 1
		}
	}
}
