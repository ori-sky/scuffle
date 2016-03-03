module Scuffle {
	export class Bullet {
		id : number
		owner : number
		color : number
		alpha : number
		radius : number
		pos : Point
		velocity : Point
		dilation : number
		damage : number

		constructor(id : number, owner : number) {
			this.id = id
			this.owner = owner
			this.color = 0xffffff
			this.alpha = 1
			this.radius = 1
			this.pos = Point.create(0, 0)
			this.velocity = Point.create(0, 0)
			this.dilation = 1
			this.damage = 20
		}

		static _pool = new Array(1024)
		static _poolLength = 0
		static create(id : number, owner : number) {
			if(Bullet._pool[0] === undefined)
				return new Bullet(id, owner)
			else {
				var obj = Bullet._pool[--Bullet._poolLength]
				Bullet._pool[Bullet._poolLength] = undefined
				obj.id = id
				obj.owner = owner
				obj.dilation = 1
				return obj
			}
		}
		pool() {
			Bullet._pool[Bullet._poolLength++] = this
			if(Bullet._poolLength === Bullet._pool.length)
				Bullet._pool.length *= 2
		}

		compress(quality? : number) {
			var obj = [this.id, this.owner, this.color]
			if(quality !== undefined)
				obj.push(+this.alpha.toFixed(quality), +this.radius.toFixed(quality))
			else
				obj.push(this.alpha, this.radius)
			obj.push(Point.prototype.compress.call(this.pos, quality))
			obj.push(Point.prototype.compress.call(this.velocity, quality))
			obj.push(this.dilation)
			if(quality !== undefined)
				obj.push(+this.damage.toFixed(quality))
			else
				obj.push(this.damage)
			return obj
		}

		static uncompress(obj : any) {
			expectLength(obj, 9)
			var bullet = Bullet.create(obj[0], obj[1])
			bullet.color = obj[2]
			bullet.alpha = obj[3]
			bullet.radius = obj[4]
			bullet.pos = Point.uncompress(obj[5])
			bullet.velocity = Point.uncompress(obj[6])
			bullet.dilation = obj[7]
			bullet.damage = obj[8]
			return bullet
		}
	}
}
