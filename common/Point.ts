module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}

		compress(quality? : number) {
			if(quality !== undefined)
				return [+this.x.toFixed(quality), +this.y.toFixed(quality)]
			else
				return [this.x, this.y]
		}

		static uncompress(obj : any) {
			expectLength(obj, 2)
			return new Point(obj[0], obj[1])
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

		normalizedTo(n : number) {
			var factor = n / Point.prototype.length.call(this)
			return new Point(this.x * factor, this.y * factor)
		}

		normalized() {
			var factor = 1 / Point.prototype.length.call(this)
			return new Point(this.x * factor, this.y * factor)
		}

		dot(p : Point) {
			return this.x * p.x + this.y * p.y
		}

		addedTo(x : number, y : number) {
			return new Point(x + this.x, y + this.y)
		}

		addedToPoint(p : Point) {
			return new Point(p.x + this.x, p.y + this.y)
		}

		subtractedFrom(x : number, y : number) {
			return new Point(x - this.x, y - this.y)
		}

		subtractedFromPoint(p : Point) {
			return new Point(p.x - this.x, p.y - this.y)
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
			this.x += p.x
			this.y += p.y
		}

		scale(s : number) {
			this.x *= s
			this.y *= s
		}

		normalizeTo(n : number) {
			var factor = n / Point.prototype.length.call(this)
			this.x *= factor
			this.y *= factor
		}

		normalize() {
			var factor = 1 / Point.prototype.length.call(this)
			this.x *= factor
			this.y *= factor
		}
	}
}
