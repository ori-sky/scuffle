module Scuffle {
	export function expectLength(obj : any, length? : number) {
		if(obj.length === undefined)
			throw new Error('object length is undefined')

		if(length !== undefined && obj.length !== length)
			throw new Error('object length expected=' + length + ' actual=' + obj.length)

		return true
	}

	export function circlesIntersect(p1 : Point, r1 : number, p2 : Point, r2 : number) {
		var v12 = Point.prototype.subtractedFromPoint.call(p1, p2)
		return v12.length() < r1 + r2
	}

	export function movingCirclesIntersect(a : Point, b : Point, r1 : number, p : Point, r2 : number) {
		var vAB = Point.prototype.subtractedFromPoint.call(a, b)
		var numSegs = Math.floor(vAB.length() / r1)
		var vSeg = vAB.normalizedTo(r1)
		var vTmp = Point.prototype.copy.call(a)
		var intersects = false
		for(var i=0; !intersects && i<numSegs; vTmp.addPoint(vSeg), ++i) {
			intersects = circlesIntersect(vTmp, r1, p, r2)
		}
		return intersects ? intersects : circlesIntersect(b, r1, p, r2)
	}
}
