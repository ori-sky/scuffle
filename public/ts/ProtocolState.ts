module Scuffle {
	export class ProtocolState extends Phaser.State {
		game : Game

		create() {
			this.game.socket.on('instance$map$change', (mapName : string) => {
				this.game.socket.once('map$get', (map : Map) => {
					this.game.state.start('Map', true, false, map)
				})
				this.game.socket.emit(Protocol.Client.MapGet, mapName)
			})
			this.game.socket.on('reset', () => {
				this.game.socket.disconnect()
				this.game.socket.socket.reconnect()
			})
			this.game.socket.on('refresh', () => {
				this.game.destroy()
				location.reload(true)
			})
			this.game.socket.on('state$on', (name : string) => this.game.localState[name] = true)
			this.game.socket.on('state$off', (name : string) => this.game.localState[name] = false)

			this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.UP)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.DOWN)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SHIFT)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.W)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.A)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.S)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.D)
			this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
			this.input.mouse.mouseDownCallback = undefined
			this.input.mouse.mouseUpCallback = undefined

			this.makeKeyState(Phaser.Keyboard.UP,       'key.up')
			this.makeKeyState(Phaser.Keyboard.DOWN,     'key.down')
			this.makeKeyState(Phaser.Keyboard.LEFT,     'key.left')
			this.makeKeyState(Phaser.Keyboard.RIGHT,    'key.right')
			this.makeKeyState(Phaser.Keyboard.W,        'key.w')
			this.makeKeyState(Phaser.Keyboard.S,        'key.s')
			this.makeKeyState(Phaser.Keyboard.A,        'key.a')
			this.makeKeyState(Phaser.Keyboard.D,        'key.d')
			this.makeKeyState(Phaser.Keyboard.SHIFT,    'key.shift')
			this.makeKeyState(Phaser.Keyboard.SPACEBAR, 'key.space')

			this.input.mouse.mouseDownCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit(Protocol.Client.StateOn, 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit(Protocol.Client.StateOn, 'mouse.right')
						break
				}
			}
			this.input.mouse.mouseUpCallback = e => {
				switch(e.button) {
					case Phaser.Mouse.LEFT_BUTTON:
						this.game.socket.emit(Protocol.Client.StateOff, 'mouse.left')
						break
					case Phaser.Mouse.RIGHT_BUTTON:
						this.game.socket.emit(Protocol.Client.StateOff, 'mouse.right')
						break
				}
			}

			this.game.socket.emit(Protocol.Client.InstanceJoin, 0)
		}

		makeKeyState(keycode : number, name : string) {
			var key = this.game.input.keyboard.addKey(keycode)
			key.onDown.add(() => {
				this.game.localState[name] = true
				this.game.socket.emit(Protocol.Client.StateOn, name)
			})
			key.onUp.add(() => {
				this.game.localState[name] = false
				this.game.socket.emit(Protocol.Client.StateOff, name)
			})
		}
	}
}
