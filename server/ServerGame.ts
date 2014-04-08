module Scuffle {
	export class ServerGame {
		maps : { [k : string] : Map }
		instances : Instance[]
		io : any

		constructor() {
			this.maps = {}
			this.instances = []
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

			var inst = new Instance(this)
			inst.map = this.maps['warehouse']
			this.instances.push(inst)
		}
	}
}
