module Scuffle {
	export class Player {
		id : number
		name : string
		color : number
		alpha : number
		radius : number
		pos : Point
		velocity : Point
		angle : number
		baseHealth : number
		health : number
		kills : number
		deaths : number
		streak : number

		constructor(id : number) {
			this.id = id
			this.name = 'Player ' + (id + 1)
			this.color = 0xffffff
			this.alpha = 1
			this.radius = 7
			this.pos = new Point(0, 0)
			this.velocity = new Point(0, 0)
			this.angle = 0
			this.baseHealth = 100
			this.health = 0
			this.kills = 0
			this.deaths = 0
			this.streak = 0
		}

		compress(quality? : number) {
			var obj = [this.id, this.name, this.color, this.alpha]
			if(quality !== undefined)
				obj.push(+this.radius.toFixed(quality), +this.angle.toFixed(quality))
			else
				obj.push(this.radius, this.angle)
			obj.push(Point.prototype.compress.call(this.pos, quality))
			obj.push(Point.prototype.compress.call(this.velocity, quality))
			obj.push(this.baseHealth, this.health, this.kills, this.deaths, this.streak)
			return obj
		}

		static uncompress(obj : any) {
			expectLength(obj, 13)
			var player = new Player(obj[0])
			player.name = obj[1]
			player.color = obj[2]
			player.alpha = obj[3]
			player.radius = obj[4]
			player.angle = obj[5]
			player.pos = Point.uncompress(obj[6])
			player.velocity = Point.uncompress(obj[7])
			player.baseHealth = obj[8]
			player.health = obj[9]
			player.kills = obj[10]
			player.deaths = obj[11]
			player.streak = obj[12]
			return player
		}

		isAlive() {
			return this.health > 0
		}
	}
}
