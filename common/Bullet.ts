module Scuffle {
	export class Bullet {
		id : number
		owner : number
		color : number
		alpha : number
		radius : number
		pos : Point
		velocity : Point
		damage : number

		constructor(id : number, owner : number) {
			this.id = id
			this.owner = owner
			this.color = 0xffffff
			this.alpha = 1
			this.radius = 1
			this.pos = Point.create(0, 0)
			this.velocity = Point.create(0, 0)
			this.damage = 20
		}

		compress(quality? : number) {
			var obj = [this.id, this.owner, this.color]
			if(quality !== undefined)
				obj.push(+this.alpha.toFixed(quality), +this.radius.toFixed(quality))
			else
				obj.push(this.alpha, this.radius)
			obj.push(Point.prototype.compress.call(this.pos, quality))
			obj.push(Point.prototype.compress.call(this.velocity, quality))
			if(quality !== undefined)
				obj.push(+this.damage.toFixed(quality))
			else
				obj.push(this.damage)
			return obj
		}

		static uncompress(obj : any) {
			expectLength(obj, 8)
			var bullet = new Bullet(obj[0], obj[1])
			bullet.color = obj[2]
			bullet.alpha = obj[3]
			bullet.radius = obj[4]
			bullet.pos = Point.uncompress(obj[5])
			bullet.velocity = Point.uncompress(obj[6])
			bullet.damage = obj[7]
			return bullet
		}
	}
}
