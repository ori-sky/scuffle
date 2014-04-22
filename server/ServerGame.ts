module Scuffle {
	export class ServerGame {
		maps      : { [k : string] : Map }
		instances : { [k : number] : Instance }
		io : any
		tickCount : number

		private previousTime : number[]
		private currentTime : number[]
		private accumulator : number

		constructor() {
			this.maps = {}
			this.instances = []
		}

		preload() {
			fs.readdirSync(__dirname + '/assets').filter((filename : string) =>
				filename.indexOf('.map.json', filename.length - '.map.json'.length) !== -1
			).forEach((filename : string) => {
				var map = JSON.parse(fs.readFileSync(__dirname + '/assets/' + filename))
				this.maps[map.name] = map
			})
		}

		protocol(io) {
			io.sockets.on('connection', socket => new Client(this, socket))
			this.io = io
		}

		init() {
			this.tickCount = 0
			this.previousTime = process.hrtime()
			this.currentTime = this.previousTime
			this.accumulator = 0
		}

		iterate() {
			this.previousTime = this.currentTime
			this.currentTime = process.hrtime()
			this.accumulator += (this.currentTime[0] - this.previousTime[0]) * 1000
			                  + (this.currentTime[1] - this.previousTime[1]) / 1000000
			if(this.accumulator > 1000)
				this.accumulator = 1000

			var timestep = 30
			while(this.accumulator >= timestep) {
				this.tick(timestep)
				this.accumulator -= timestep
			}
		}

		tick(time : number) {
			++this.tickCount
			for(var k in this.instances)
				this.instances[k].tick(time)
		}

		start(io) {
			this.preload()
			this.protocol(io)
			this.init()
			setInterval(this.iterate.bind(this), 10)

			this.instances[0] = new Instance(this, 0)
			this.instances[0].map = this.maps['warehouse']
		}
	}
}
