module Scuffle {
	export function circlesIntersect(p1 : Point, r1 : number, p2 : Point, r2 : number) {
		var v = Point.prototype.addedToPoint.call(p2, Point.prototype.scaledBy.call(p1, -1))
		return v.length() < r1 + r2
	}
}
