module Scuffle {
	export class ServerGame {
		maps    : { [k : string] : Map }
		players : { [k : number] : Player }
		io : any

		constructor() {
			this.maps = {}
			this.players = {}
		}

		preload() {
			fs.readdirSync(__dirname + '/assets').filter((filename : string) =>
				filename.indexOf('.map.json', filename.length - '.map.json'.length) !== -1
			).forEach((filename : string) => {
				var contents = fs.readFileSync(__dirname + '/assets/' + filename)
				this.maps[filename.split('.')[0]] = JSON.parse(contents)
			})
		}

		protocol(io) {
			io.sockets.on('connection', socket => new Client(this, socket))
			this.io = io
		}

		start(io) {
			this.preload()
			this.protocol(io)
		}

		firstAvailableID() {
			for(var id=0; this.players[id]!==undefined; ++id) {}
			return id
		}
	}
}
