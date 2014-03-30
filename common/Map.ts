module Scuffle {
	export class Point {
		x : number
		y : number

		constructor(x : number, y : number) {
			this.x = x
			this.y = y
		}
	}

	export class Line {
		a : Point
		b : Point

		constructor(a : Point, b : Point) {
			this.a = a
			this.b = b
		}
	}

	export class Map {
		name : string
		lines : Line[]

		constructor(name : string, lines : Line[] = []) {
			this.name = name
			this.lines = lines
		}

		pushLine(line : Line) {
			this.lines.push(line)
		}
	}
}
