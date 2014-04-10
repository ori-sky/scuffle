module Scuffle {
	export class Player {
		id : number
		pos : Point
		velocity : Point

		constructor(id : number) {
			this.id = id
			this.pos = new Point(0, 0)
			this.velocity = new Point(0, 0)
		}
	}
}
