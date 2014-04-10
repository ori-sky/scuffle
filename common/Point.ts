module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}

		isZero() {
			return this.x == 0 && this.y == 0
		}

		add(x : number, y : number) {
			this.x += x
			this.y += y
		}

		addPoint(p : Point) {
			Point.prototype.add.call(this, p.x, p.y)
		}
	}
}
