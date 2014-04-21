declare var io : {
	connect(url : string, options? : any) : Socket
}

interface Socket {
	socket : any
	disconnect() : Socket
	on(event : any, callback : Function)
	once(event : any, callback : Function)
	emit(event : any, data? : any)
	removeAllListeners(event? : any)
}
