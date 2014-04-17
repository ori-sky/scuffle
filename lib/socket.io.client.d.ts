declare var io : {
	connect(url : string, options? : any) : Socket
}

interface Socket {
	socket : any
	disconnect() : Socket
	on(event : string, callback : Function)
	once(event : string, callback : Function)
	emit(event : string, data? : any)
	removeAllListeners(event? : string)
}
