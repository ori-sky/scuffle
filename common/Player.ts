module Scuffle {
	export class Player {
		id : number
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

		constructor(id : number) {
			this.id = id
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
		}

		isAlive() {
			return this.health > 0
		}
	}
}
