module Scuffle {
	export class Instance {
		game : ServerGame
		map : Map
		players : { [k : number] : Player }

		constructor(game : ServerGame) {
			this.game = game
			this.players = {}
		}

		newPlayer() {
			var id = this.firstAvailableID()
			return (this.players[id] = new Player(id))
		}

		firstAvailableID() {
			for(var id=0; this.players[id]!==undefined; ++id) {}
			return id
		}
	}
}
