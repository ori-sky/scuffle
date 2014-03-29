module Scuffle {
	export class BootState extends Phaser.State {
		preload() {
			this.load.image('bar1', 'img/bar1.png')
		}

		create() {
			this.input.maxPointers = 1
			this.stage.disableVisibilityChange = true
			this.game.state.start('Preload')

			/*
			var graphics = this.add.graphics(0, 0)
			graphics.lineStyle(5, 0xffd900, 1)
			graphics.moveTo(50, 30)
			graphics.lineTo(170, 160)
			*/
		}
	}
}
