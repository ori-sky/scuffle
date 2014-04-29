module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}

		static _pool = new Array(1024)
		static _poolLength = 0
		static create(x : number, y : number) {
			if(Point._pool[0] === undefined)
				return new Point(x, y)
			else {
				var obj = Point._pool[--Point._poolLength]
				Point._pool[Point._poolLength] = undefined
				obj.x = x
				obj.y = y
				return obj
			}
		}
		pool() {
			Point._pool[Point._poolLength++] = this
		}

		compress(quality? : number) {
			if(quality !== undefined)
				return [+this.x.toFixed(quality), +this.y.toFixed(quality)]
			else
				return [this.x, this.y]
		}

		static uncompress(obj : any) {
			expectLength(obj, 2)
			return Point.create(obj[0], obj[1])
		}

		copy() {
			return Point.create(this.x, this.y)
		}

		isZero() {
			return this.x == 0 && this.y == 0
		}

		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}

		normalizedTo(n : number) {
			var factor = n / Point.prototype.length.call(this)
			return Point.create(this.x * factor, this.y * factor)
		}

		normalized() {
			var factor = 1 / Point.prototype.length.call(this)
			return Point.create(this.x * factor, this.y * factor)
		}

		dot(x : number, y : number) {
			return this.x * x + this.y * y
		}

		dotPoint(p : Point) {
			return this.x * p.x + this.y * p.y
		}

		addedTo(x : number, y : number) {
			return Point.create(x + this.x, y + this.y)
		}

		addedToPoint(p : Point) {
			return Point.create(p.x + this.x, p.y + this.y)
		}

		subtractedFrom(x : number, y : number) {
			return Point.create(x - this.x, y - this.y)
		}

		subtractedFromPoint(p : Point) {
			return Point.create(p.x - this.x, p.y - this.y)
		}

		scaledBy(s : number) {
			return Point.create(this.x * s, this.y * s)
		}

		angleTo(p : Point) {
			return Math.atan2(p.y, p.x) - Math.atan2(this.y, this.x)
		}

		halfwayToPoint(p : Point) {
			return Point.create((this.x + p.x) / 2, (this.y + p.y) / 2)
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
