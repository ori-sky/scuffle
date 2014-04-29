module Scuffle {
	export class Activator {
		threshold : number
		context : any
		predicate : Function
		callback : Function

		private accumulator : number

		constructor(threshold : number, context : any) {
			this.threshold = threshold
			this.context = context
			this.accumulator = 0
		}

		tick(amount : number) {
			this.accumulator += Math.min(amount, this.threshold)
			if(this.predicate && this.predicate.call(this.context, this))
				if(this.accumulator >= this.threshold) {
					if(this.callback)
						this.callback.call(this.context, this)
					this.accumulator = 0
				}
		}
	}
}
