module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}

		add(v : Point) {
			this.x += v.x
			this.y += v.y
		}
	}
}
