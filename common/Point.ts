module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}

		copy() {
			return new Point(this.x, this.y)
		}

		isZero() {
			return this.x == 0 && this.y == 0
		}

		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}

		dot(p : Point) {
			return this.x * p.x + this.y * p.y
		}

		addedTo(x : number, y : number) {
			return new Point(this.x + x, this.y + y)
		}

		addedToPoint(p : Point) {
			return Point.prototype.addedTo.call(this, p.x, p.y)
		}

		subtractedFrom(x : number, y : number) {
			return new Point(x - this.x, y - this.y)
		}

		subtractedFromPoint(p : Point) {
			return Point.prototype.subtractedFrom.call(this, p.x, p.y)
		}

		scaledBy(s : number) {
			return new Point(this.x * s, this.y * s)
		}

		angleTo(p : Point) {
			return Math.atan2(p.y, p.x) - Math.atan2(this.y, this.x)
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
