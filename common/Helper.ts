module Scuffle {
	export function circlesIntersect(p1 : Point, r1 : number, p2 : Point, r2 : number) {
		var v12 = Point.prototype.subtractedFromPoint.call(p1, p2)
		return v12.length() < r1 + r2
	}
}
