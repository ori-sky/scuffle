module Scuffle {
	export class PreloadState extends Phaser.State {
		bar : Phaser.Sprite

		preload() {
			this.bar = this.add.sprite(this.world.centerX - 400, this.world.centerY - 25, 'bar1')
			this.bar.alpha = 0
			var tween = this.add.tween(this.bar).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
			this.load.setPreloadSprite(this.bar)
			for(var i=2; i<50; ++i)
				this.load.image('bar' + i, 'img/bar1.png')
			this.load.image('logo', 'img/phaser2.png')
		}

		create() {
			var tween = this.add.tween(this.bar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
		}
	}
}
