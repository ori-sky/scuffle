module Scuffle {
	export class BootState extends Phaser.State {
		preload() {
			this.load.image('bar1', 'img/bar1.png')
		}

		create() {
			this.input.maxPointers = 1
			this.stage.disableVisibilityChange = true
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
			this.game.state.start('Preload')
		}
	}
}
