module Scuffle {
	export class Weapon extends Activator {
		constructor(threshold : number, context : Client) {
			super(threshold, context)
			this.predicate = () => context.player.isAlive() && (context.state['mouse.left'] || context.state['key.space'])
		}
	}
}
