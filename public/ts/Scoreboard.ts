module Scuffle {
	export class Scoreboard {
		game : Phaser.Game
		group : Phaser.Group
		x : number
		y : number
		width : number
		height : number

		constructor(game : Phaser.Game) {
			this.game = game

			this.width = 800
			this.height = game.height - 100
			this.x = game.width / 2 - this.width / 2
			this.y = game.height / 2 - this.height / 2

			this.group = game.add.group()
			this.group.fixedToCamera = true
			this.group.alpha = 0

			var g = game.add.graphics(0, 0, this.group)
			// base
			g.beginFill(0x191f23, 1)
			g.drawRect(this.x, this.y, this.width, this.height)
			g.endFill()
			// header
			g.beginFill(0x7d8091, 1)
			g.drawRect(this.x, this.y, this.width, 48)
			g.endFill()

			var style = {
				font: '32px Iceland',
				strokeThickness: 3,
				stroke: '#fff',
				fill: '#191f23'
			}
			game.add.text(this.x + 50, this.y + 6, 'Name', style, this.group)
			game.add.text(this.x + this.width - 110, this.y + 6, 'Deaths', style, this.group)
			game.add.text(this.x + this.width - 230, this.y + 6, 'Streak', style, this.group)
			game.add.text(this.x + this.width - 325, this.y + 6, 'Kills', style, this.group)
		}

		show() {
			this.game.add.tween(this.group).to({ alpha: 0.4 }, 100, Phaser.Easing.Linear.None, true)
		}

		hide() {
			this.game.add.tween(this.group).to({ alpha: 0 }, 150, Phaser.Easing.Linear.None, true)
		}
	}
}
