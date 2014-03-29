module Scuffle {
	export class PreloadState extends Phaser.State {
		bar : Phaser.Sprite

		preload() {
			this.bar = this.add.sprite(this.world.centerX - 400, this.world.centerY - 25, 'bar1')
			this.load.setPreloadSprite(this.bar)
			this.load.image('bar2', 'img/bar1.png')
			this.load.image('bar3', 'img/bar1.png')
			this.load.image('bar4', 'img/bar1.png')
			this.load.image('bar5', 'img/bar1.png')
			this.load.image('bar6', 'img/bar1.png')
			this.load.image('bar7', 'img/bar1.png')
			this.load.image('bar8', 'img/bar1.png')
			this.load.image('bar9', 'img/bar1.png')
			this.load.image('bar10', 'img/bar1.png')
			this.load.image('bar11', 'img/bar1.png')
			this.load.image('bar12', 'img/bar1.png')
			this.load.image('bar13', 'img/bar1.png')
			this.load.image('bar14', 'img/bar1.png')
			this.load.image('bar15', 'img/bar1.png')
			this.load.image('bar16', 'img/bar1.png')
			this.load.image('bar17', 'img/bar1.png')
			this.load.image('bar18', 'img/bar1.png')
			this.load.image('bar19', 'img/bar1.png')
			this.load.image('logo', 'img/phaser2.png')
		}

		create() {
			var tween = this.add.tween(this.bar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
		}
	}
}
