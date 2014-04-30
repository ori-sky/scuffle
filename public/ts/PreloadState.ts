module Scuffle {
	export class PreloadState extends Phaser.State {
		group : Phaser.Group

		preload() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)

			var bar = this.add.sprite(this.world.centerX - 400, this.world.centerY + 60, 'bar1', 0, this.group)
			this.load.setPreloadSprite(bar)

			this.load.image('crate1', 'img/crate1.png')
			this.load.image('phaser2logo', 'img/phaser2.png')
			this.load.image('crosshair1', 'img/crosshair1.png')
			this.load.image('crosshair2', 'img/crosshair2.png')
			this.load.image('audio.button', 'img/audio.button.png')
			this.load.image('x.button', 'img/x.button.png')
			this.load.image('screen1', 'img/screen1.png')
			this.load.image('bullet.arrow1', 'img/bullet.arrow1.png')
			this.load.audio('warehouse', 'audio/warehouse.ogg', true)
			this.load.audio('beep1', 'audio/beep1.ogg', true)
			this.load.audio('beep2', 'audio/beep2.ogg', true)

			var text = this.add.text(this.world.centerX, this.world.centerY, 'Loading', undefined, this.group)
			text.anchor.setTo(0.5, 0.5)
			text.font = 'Iceland'
			text.fontSize = 60
			text.fill = '#acf'
		}

		create() {
			var tween = this.add.tween(this.group).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
			tween.onComplete.add(() => this.game.state.start('Connect'))
		}
	}
}
