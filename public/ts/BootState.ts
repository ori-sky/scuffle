module Scuffle
{
	export class BootState extends Phaser.State
	{
		logo : Phaser.Sprite

		preload()
		{
			this.load.image('logo', 'img/phaser2.png')
		}

		create()
		{
			this.input.maxPointers = 1
			this.stage.disableVisibilityChange = true

			this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo')
			this.logo.anchor.setTo(0.5, 0.5)
		}
	}
}
