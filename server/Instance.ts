module Scuffle {
	export class Instance {
		game : ServerGame
		id : number
		map : Map
		players : { [k : number] : Player }

		constructor(game : ServerGame, id : number) {
			this.game = game
			this.id = id
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
