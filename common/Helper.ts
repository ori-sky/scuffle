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

	export function tickPlayerVelocity(time : number, state : any, player : Player) {
			var moveVector = new Point(0, 0)
			if(state['key.a'] || state['key.left'])
				moveVector.add(-1,  0)
			if(state['key.d'] || state['key.right'])
				moveVector.add( 1,  0)
			if(state['key.w'] || state['key.up'])
				moveVector.add( 0, -1)
			if(state['key.s'] || state['key.down'])
				moveVector.add( 0,  1)

			var vel = Point.prototype.copy.call(player.velocity)
			if(!moveVector.isZero()) {
				moveVector.normalize()
				moveVector.scale(0.0025 * time)
				if(state['key.shift'])
					moveVector.scale(1 / 2)
				vel.addPoint(moveVector)
			}

			vel.scale(1 - 0.011 * time)
			if(vel.length() < 0.005)
				vel.zero()

			return (player.velocity = vel)
	}
}
