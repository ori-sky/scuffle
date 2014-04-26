module Scuffle {
	export class Row {
		cli : ClientPlayer
		group : Phaser.Group
		tName : Phaser.Text
		tKills : Phaser.Text
		tStreak : Phaser.Text
		tDeaths : Phaser.Text

		static compare(a : Row, b : Row) {
			if(a.cli.player.kills > b.cli.player.kills)
				return 1
			else if(a.cli.player.kills < b.cli.player.kills)
				return -1
			else
				if(a.cli.player.deaths < b.cli.player.deaths)
					return 1
				else if(a.cli.player.deaths > b.cli.player.deaths)
					return -1
				else
					if(a.cli.player.streak > b.cli.player.streak)
						return 1
					else if(a.cli.player.streak < b.cli.player.streak)
						return -1
					else
						return 0
		}

		constructor(sb : Scoreboard, cli : ClientPlayer) {
			this.cli = cli

			this.group = sb.game.add.group(sb.group)
			var style = {
				font: '32px VT323',
				strokeThickness: 2,
				stroke: '#fff',
				fill: '#356'
			}
			this.tName = sb.game.add.text(0, 0, cli.player.name, style, this.group)
		}

		destroy() {
			this.group.destroy(true)
		}
	}

	export class Scoreboard {
		game : Phaser.Game
		x : number
		y : number
		width : number
		height : number
		group : Phaser.Group
		rows : Row[]

		constructor(game : Phaser.Game) {
			this.game = game
			this.rows = []

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

			this.update()
		}

		show() {
			this.game.add.tween(this.group).to({ alpha: 0.5 }, 100, Phaser.Easing.Linear.None, true)
		}

		hide() {
			this.game.add.tween(this.group).to({ alpha: 0 }, 150, Phaser.Easing.Linear.None, true)
		}

		addRowFor(cli : ClientPlayer) {
			this.rows.push(new Row(this, cli))
			this.update()
		}

		removeRowFor(cli : ClientPlayer) {
			for(var i=0; i<this.rows.length; ++i) {
				if(this.rows[i].cli === cli) {
					this.rows.splice(i)[0].destroy()
					break
				}
			}
			this.update()
		}

		update() {
			this.rows.sort(Row.compare)

			this.rows.forEach((row : Row, i : number) => {

			})
		}
	}
}
