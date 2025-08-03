// Event Emitter

export class EventEmitter {
	constructor() {
		this.listeners = {};
	}
	
	on(event, newlistener) {
		if (!(event in this.listeners))
			this.listeners[event] = [];
		this.listeners[event].push(newlistener);
		return this;
	}
	
	off(event, oldlistener) {
		if (event in this.listeners)
			for (var i = 0; i < this.listeners[event].length; i++)
				if (this.listeners[event][i] === oldlistener)
					this.listeners[event].splice(i--, 1);
		return this;
	}
	
	emit(event, data) {
		if (event in this.listeners)
			this.listeners[event].forEach(function(listener) {
				listener(data);
			});
		return this;
	}
}
