module Scuffle {
	export class ConnectState extends Phaser.State {
		game : Game

		options = {
			'connect timeout': 2000,
			'reconnection limit': 1000,
			'max reconnection attempts': Infinity
		}

		create() {
			var group = this.add.group()
			group.alpha = 0

			var text = this.add.text(this.world.centerX, this.world.centerY,
				this.game.socket === undefined ? 'Connecting' : 'Reconnecting',
				undefined, group)
			text.anchor.setTo(0.5, 0.5)
			text.font = 'Iceland'
			text.fontSize = 60
			text.fill = '#acf'

			var tween = this.add.tween(group).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)
			tween.onComplete.add(() => {
				if(this.game.socket === undefined)
					this.game.socket = io.connect('//shockk.me', this.options)
				else
					this.game.socket.removeAllListeners()

				this.game.socket.once('connect', () => {
					var tween = this.add.tween(group).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
					tween.onComplete.add(() => this.game.state.start('Protocol'))
				})
				this.game.socket.once('disconnect', () => this.game.state.start('Connect'))

				if(this.game.latencyInterval !== undefined)
					clearInterval(this.game.latencyInterval)
				this.game.latencyInterval = setInterval(() => {
					var tStart = performance.now()
					this.game.socket.emit(Protocol.Client.Ping)
					this.game.socket.once(Protocol.Server.Pong, () => {
						var newLatency = performance.now() - tStart
						this.game.latency += (newLatency - this.game.latency) / 3
					})
				}, 500)
			})
		}
	}
}
