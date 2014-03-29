module Scuffle {
	export class BootState extends Phaser.State {
		preload() {
			this.load.image('bar', 'img/bar1.png')
		}

		create() {
			this.input.maxPointers = 1
			this.stage.disableVisibilityChange = true
			this.stage.backgroundColor = '#000000'

			var bar = this.add.sprite(this.world.centerX, this.world.centerY, 'bar')
			bar.anchor.setTo(0.5, 0.5)

			/*
			var graphics = this.add.graphics(0, 0)
			graphics.lineStyle(5, 0xffd900, 1)
			graphics.moveTo(50, 30)
			graphics.lineTo(170, 160)
			*/
		}
	}
}
