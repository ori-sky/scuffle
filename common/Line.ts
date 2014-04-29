module Scuffle {
	export class Line {
		a : Point
		b : Point
		width : number
		color : string

		constructor(a : Point, b : Point) {
			this.a = a
			this.b = b
		}

		vector() {
			return new Point(this.b.x - this.a.x, this.b.y - this.a.y)
		}

		normal() {
			var p = new Point(this.a.y - this.b.y, this.b.x - this.a.x)
			p.normalize()
			return p
		}

		oppositeNormal() {
			var p = new Point(this.b.y - this.a.y, this.a.x - this.b.x)
			p.normalize()
			return p
		}

		intersectsLineOf(a : Point, b : Point) {
			var onSegment = (p : Point, q : Point, r : Point) => {
				if(q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x)
				&& q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
					return true
				else
					return false
			}
			var orientation = (p : Point, q : Point, r : Point) => {
				var val = (q.y - p.y) * (r.x - q.x)
				        - (q.x - p.x) * (r.y - q.y)

				if(val === 0)
					return 0
				else
					return (val > 0) ? 1 : 2
			}

			var o1 = orientation(this.a, this.b, a)
			var o2 = orientation(this.a, this.b, b)
			var o3 = orientation(a, b, this.a)
			var o4 = orientation(a, b, this.b)

			if(o1 !== o2 && o3 !== o4)
				return true

			if(o1 === 0 && onSegment(this.a, a, this.b))
				return true
			if(o2 === 0 && onSegment(this.a, b, this.b))
				return true
			if(o3 === 0 && onSegment(a, this.a, b))
				return true
			if(o4 === 0 && onSegment(a, this.b, b))
				return true

			return false
		}

		intersectsLine(l : Line) {
			return Line.prototype.intersectsLineOf.call(this, l.a, l.b)
		}

		intersectsCircleOf(p : Point, r : number) {
			var dirx = this.b.x - this.a.x
			var diry = this.b.y - this.a.y
			var vecx = this.a.x - p.x
			var vecy = this.a.y - p.y
			var a = dirx * dirx + diry * diry
			var b = vecx * dirx + vecy * diry
			var c = vecx * vecx + vecy * vecy - r * r
			var disc = b * b - a * c

			if(disc < 0)
				return false

			var sqrtDisc = Math.sqrt(disc)
			var par1 = -b - sqrtDisc
			var par2 = -b + sqrtDisc
			var int1 = par1 >= 0 && par1 <= a
			var int2 = par2 >= 0 && par2 <= a
			return int1 || int2
		}

		intersectsMovingCircleOf(a : Point, b : Point, r : number) {
			// perform initial inaccurate region intersection check
			var vAB = Point.prototype.subtractedFromPoint.call(a, b)
			var lenAB = vAB.length()
			var vHalf = Point.prototype.halfwayToPoint.call(a, b)
			if(!Line.prototype.intersectsCircleOf.call(this, vHalf, lenAB / 2 + r * 2)) {
				vAB.pool()
				vHalf.pool()
				return false
			}

			var numSegs = Math.floor(lenAB / r)
			var vSeg = vAB.normalizedTo(r)
			var vTmp = Point.prototype.copy.call(a)
			var intersects = false
			for(var i=0; !intersects && i<numSegs; vTmp.addPoint(vSeg), ++i) {
				intersects = Line.prototype.intersectsCircleOf.call(this, vTmp, r)
			}

			vAB.pool()
			vHalf.pool()
			vSeg.pool()
			vTmp.pool()
			return intersects ? intersects : Line.prototype.intersectsCircleOf.call(this, b, r)
		}
	}
}
