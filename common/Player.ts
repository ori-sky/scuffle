module Scuffle {
	export class Player {
		id : number
		pos : Point

		constructor(id : number) {
			this.id = id
			this.pos = new Point(0, 0)
		}
	}
}
