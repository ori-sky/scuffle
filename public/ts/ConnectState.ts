module Scuffle {
	export class ConnectState extends Phaser.State {
		game : Game

		create() {
			var group = this.add.group()
			group.alpha = 0

			var text = this.add.text(this.world.centerX, this.world.centerY,
				'Connecting', undefined, group)
			text.anchor.setTo(0.5, 0.5)
			text.font = 'Iceland'
			text.fontSize = 60
			text.fill = '#acf'

			var tween = this.add.tween(group).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true)
			tween.onComplete.add(() => {
				if(this.game.socket === undefined)
					this.game.socket = io.connect('http://yellow.shockk.co.uk:1337')

				this.game.socket.once('connect', () => {
					var tween = this.add.tween(group).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
					tween.onComplete.add(() => this.game.state.start('Preload'))
				})
				this.game.socket.on('disconnect', () => this.game.state.start('Connect'))
			})
		}
	}
}
