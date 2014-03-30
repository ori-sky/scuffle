module Scuffle {
	export class Point {
		x : number
		y : number
	}

	export class Line {
		a : Point
		b : Point
	}

	export class Map {
		name : string
		lines : Line[]
	}
}
