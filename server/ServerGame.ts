module Scuffle {
	export class ServerGame {
		maps      : { [k : string] : Map }
		instances : { [k : number] : Instance }
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

			this.instances[0] = new Instance(this, 0)
			this.instances[0].map = this.maps['warehouse']
		}
	}
}
