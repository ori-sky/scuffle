module Scuffle {
	export class ProtocolState extends Phaser.State {
		game : Game

		create() {
			this.game.socket.on('instance$map$change', (mapName : string) => {
				this.game.socket.once('map$get', (map : Map) => {
					this.game.state.start('Map', true, false, map)
				})
				this.game.socket.emit('map$get', mapName)
			})
			this.game.socket.on('reset', () => {
				this.game.socket.disconnect()
				this.game.socket.socket.reconnect()
			})
			this.game.socket.on('refresh', () => {
				this.game.destroy()
				location.reload(true)
			})

			this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.UP)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SHIFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.W)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.A)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.S)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.D)
			this.input.mouse.mouseDownCallback = undefined
			this.input.mouse.mouseUpCallback = undefined

			var cursorKeys = this.game.input.keyboard.createCursorKeys()
			var kShift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
			var kW = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
			var kA = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
			var kS = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
			var kD = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
			cursorKeys.left .onDown.add(() => this.game.socket.emit('state$on', 'key.left'))
			cursorKeys.right.onDown.add(() => this.game.socket.emit('state$on', 'key.right'))
			cursorKeys.up   .onDown.add(() => this.game.socket.emit('state$on', 'key.up'))
			cursorKeys.down .onDown.add(() => this.game.socket.emit('state$on', 'key.down'))
			kShift.onDown.add(() => this.game.socket.emit('state$on', 'key.shift'))
			kW.onDown.add(() => this.game.socket.emit('state$on', 'key.w'))
			kA.onDown.add(() => this.game.socket.emit('state$on', 'key.a'))
			kS.onDown.add(() => this.game.socket.emit('state$on', 'key.s'))
			kD.onDown.add(() => this.game.socket.emit('state$on', 'key.d'))
			cursorKeys.left .onUp.add(() => this.game.socket.emit('state$off', 'key.left'))
			cursorKeys.right.onUp.add(() => this.game.socket.emit('state$off', 'key.right'))
			cursorKeys.up   .onUp.add(() => this.game.socket.emit('state$off', 'key.up'))
			cursorKeys.down .onUp.add(() => this.game.socket.emit('state$off', 'key.down'))
			kShift.onUp.add(() => this.game.socket.emit('state$off', 'key.shift'))
			kW.onUp.add(() => this.game.socket.emit('state$off', 'key.w'))
			kA.onUp.add(() => this.game.socket.emit('state$off', 'key.a'))
			kS.onUp.add(() => this.game.socket.emit('state$off', 'key.s'))
			kD.onUp.add(() => this.game.socket.emit('state$off', 'key.d'))

			this.input.mouse.mouseDownCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit('state$on', 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit('state$on', 'mouse.right')
						break
				}
			}
			this.input.mouse.mouseUpCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit('state$off', 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit('state$off', 'mouse.right')
						break
				}
			}

			this.game.socket.emit('instance$join', 0)
		}
	}
}
