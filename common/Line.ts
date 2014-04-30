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
			return Point.create(this.b.x - this.a.x, this.b.y - this.a.y)
		}

		normal() {
			var p = Point.create(this.a.y - this.b.y, this.b.x - this.a.x)
			p.normalize()
			return p
		}

		oppositeNormal() {
			var p = Point.create(this.b.y - this.a.y, this.a.x - this.b.x)
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

		_f(vP : Point, vR : Point, radius : number) {
			var vPR = vP.subtractedFromPoint(vR)
			vPR.scale(0.5)
			var lenPQ = vPR.length()
			var vQ = vPR
			vQ.addPoint(vP)
			var intersects = Line.prototype.intersectsCircleOf.call(this, vQ, radius)
			if(!intersects && lenPQ > radius) {
				intersects = Line.prototype.intersectsCircleOf.call(this, vQ, lenPQ + radius)
				if(intersects)
					intersects = Line.prototype._f.call(this, vP, vQ, radius)
					          || Line.prototype._f.call(this, vQ, vR, radius)
			}
			vQ.pool()
			return intersects
		}
		intersectsMovingCircleOf(a : Point, b : Point, r : number) {
			return Line.prototype.intersectsCircleOf.call(this, a, r)
			    || Line.prototype.intersectsCircleOf.call(this, b, r)
			    || Line.prototype._f.call(this, a, b, r)
		}

		intersectsTCircleOf(p : Point, r : number) {
			var vNormal = Line.prototype.normal.call(this)
			vNormal.normalizeTo(this.width / 2)
			var vA1 = vNormal.subtractedFromPoint(this.a)
			var vA2 = vNormal.addedToPoint(this.a)
			var vB1 = vNormal.subtractedFromPoint(this.b)
			var vB2 = vNormal.addedToPoint(this.b)
			var l1 = new Line(vA1, vA2)
			var l2 = new Line(vA2, vB2)
			var l3 = new Line(vB2, vB1)
			var l4 = new Line(vB1, vA1)

			return l1.intersectsCircleOf(p, r)
			    || l2.intersectsCircleOf(p, r)
			    || l3.intersectsCircleOf(p, r)
			    || l4.intersectsCircleOf(p, r)
		}

		intersectsTMovingCircleOf(a : Point, b : Point, r : number) {
			var vNormal = Line.prototype.normal.call(this)
			vNormal.normalizeTo((this.width || 2) / 2)
			var vA1 = vNormal.subtractedFromPoint(this.a)
			var vA2 = vNormal.addedToPoint(this.a)
			var vB1 = vNormal.subtractedFromPoint(this.b)
			var vB2 = vNormal.addedToPoint(this.b)
			var l1 = new Line(vA1, vA2)
			var l2 = new Line(vA2, vB2)
			var l3 = new Line(vB2, vB1)
			var l4 = new Line(vB1, vA1)

			return l1.intersectsMovingCircleOf(a, b, r)
			    || l2.intersectsMovingCircleOf(a, b, r)
			    || l3.intersectsMovingCircleOf(a, b, r)
			    || l4.intersectsMovingCircleOf(a, b, r)
		}
	}
}
