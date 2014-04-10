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

		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}

		addedTo(x : number, y : number) {
			return new Point(this.x + x, this.y + y)
		}

		addedToPoint(p : Point) {
			return Point.prototype.addedTo.call(this, p.x, p.y)
		}

		zero() {
			this.x = 0
			this.y = 0
		}

		add(x : number, y : number) {
			this.x += x
			this.y += y
		}

		addPoint(p : Point) {
			Point.prototype.add.call(this, p.x, p.y)
		}

		scale(s : number) {
			this.x *= s
			this.y *= s
		}

		normalizeTo(n : number) {
			Point.prototype.scale.call(this, n / this.length())
		}

		normalize() {
			Point.prototype.normalizeTo.call(this, 1)
		}
	}
}
