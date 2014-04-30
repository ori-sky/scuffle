module Scuffle {
	export function expectLength(obj : any, length? : number) {
		if(obj.length === undefined)
			throw new Error('object length is undefined')

		if(length !== undefined && obj.length !== length)
			throw new Error('object length expected=' + length + ' actual=' + obj.length)

		return true
	}

	export function circlesIntersect(p1 : Point, r1 : number, p2 : Point, r2 : number) {
		var v12 = Point.prototype.subtractedFromPoint.call(p1, p2).pool()
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
		vAB.pool()
		vSeg.pool()
		vTmp.pool()
		return intersects ? intersects : circlesIntersect(b, r1, p, r2)
	}

	export function tickPlayerVelocity(time : number, state : any, player : Player) {
		var moveVector = Point.create(0, 0)
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
		var velScaled = vel.scaledBy(-0.011)
		deltaVel.addPoint(velScaled)
		deltaVel.scale(time)
		vel.addPoint(deltaVel)

		if(vel.length() < 0.005)
			vel.zero()

		deltaVel.pool()
		velScaled.pool()
		return vel
	}

	export function tickPlayerMovement(time : number, state : any, player : Player, map : Map) {
		var vel = tickPlayerVelocity(time, state, player)
		player.velocity.pool()
		player.velocity = vel

		if(!player.velocity.isZero()) {
			var newPos : Point
			var intersects = true
			for(var i=0; intersects && i<5; ++i) {
				var vTmp  = player.velocity.scaledBy(time)
				newPos = Point.prototype.addedToPoint.call(player.pos, vTmp)
				vTmp.pool()

				intersects = false
				map.lines.every((ln : Line) => {
					if(Line.prototype.intersectsTMovingCircleOf.call(ln, player.pos, newPos, player.radius)) {
						intersects = true
						var normal = Line.prototype.normal.call(ln)
						var radians = normal.angleTo(player.velocity)
						var len = player.velocity.length()
						player.velocity.pool()
						player.velocity = Line.prototype.vector.call(ln)
						player.velocity.normalizeTo(-Math.sin(radians) * len)
						normal.pool()
						newPos.pool()
						return false
					}
					return true
				})
			}
			if(!intersects) {
				player.pos.pool()
				player.pos = newPos
			}
			return true
		}
		return false
	}
}
