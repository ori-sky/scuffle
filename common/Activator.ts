module Scuffle {
	export class Activator {
		threshold : number
		predicate : Function
		callback : Function

		private accumulator : number

		constructor(threshold : number) {
			this.threshold = threshold
			this.accumulator = 0
		}

		tick(amount : number) {
			this.accumulator += Math.min(amount, this.threshold)
			if(this.predicate && this.predicate(this))
				if(this.accumulator >= this.threshold) {
					if(this.callback)
						this.callback(this)
					this.accumulator = 0
				}
		}
	}
}
