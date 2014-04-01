module Scuffle {
	export class Point {
		x : number
		y : number
	}

	export class Line {
		a : Point
		b : Point
		width : number
		color : number
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
		lineWidth : number
		lineColor : number
	}
}
