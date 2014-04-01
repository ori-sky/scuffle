module Scuffle {
	export class Point {
		x : number
		y : number
	}

	export class Line {
		a : Point
		b : Point
	}

	export class Sprite {
		source : string
		pos : Point
		size : Point
	}

	export class Map {
		name : string
		sprites : Sprite[]
		lines : Line[]
	}
}
