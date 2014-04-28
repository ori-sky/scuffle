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
		var deltaVel = moveVector
		if(!deltaVel.isZero()) {
			deltaVel.normalizeTo(0.0025)
			if(state['key.shift'])
				deltaVel.scale(1 / 2)
		}
		deltaVel.addPoint(vel.scaledBy(-0.011))
		deltaVel.scale(time)
		vel.addPoint(deltaVel)

		if(vel.length() < 0.005)
			vel.zero()

		return vel
	}

	export function tickPlayerMovement(time : number, state : any, player : Player, map : Map) {
		var vel = tickPlayerVelocity(time, state, player)
		player.velocity = vel

		if(!player.velocity.isZero()) {
			var newPos : Point
			var intersects = true
			for(var i=0; intersects && i<5; ++i) {
				newPos = Point.prototype.addedToPoint.call(player.pos, player.velocity.scaledBy(time))

				intersects = false
				map.lines.every((ln : Line) => {
					if(Line.prototype.intersectsMovingCircleOf.call(ln, player.pos, newPos, player.radius)) {
						intersects = true
						var radians = Line.prototype.normal.call(ln).angleTo(player.velocity)
						var len = player.velocity.length()
						player.velocity = Line.prototype.vector.call(ln)
						player.velocity.normalizeTo(-Math.sin(radians) * len)
						return false
					}
					return true
				})
			}
			if(!intersects)
				player.pos = newPos
			return true
		}
		return false
	}
}
