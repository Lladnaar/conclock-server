import { EventEmitter } from './eventemitter.js';

export class Timer extends EventEmitter {
	constructor() {
		super();
		this.offset = 0;
		
		this.timer = setInterval(function() { this.doTick(); }.bind(this), 500);
	}

	setTime(time) {
		return this.setOffset(time - Date.now());
	}

	setOffset(offset) {
		this.offset = offset;
		return this.doTick();
	}

	getTime(time) {
		return new Date(Date.now() + this.offset);
	}

	getState() {
		return {
			time: this.getTime()
		};
	}

	doTick() {
		return this.emit('tick', this.getState());
	}
}

export class PersistantTimer extends Timer {
	constructor() {
		super();
		this.loadTime();
	}

	setTime(time) {
		return super.setTime(time).setStatus('manual');
	}

	setOffset(offset) {
		localStorage.setItem('TimerOffset', offset);
		return super.setOffset(offset);
	}

	setStatus(status) {
		this.status = status;
		return this.doStatus();
	}

	getState() {
		var state = super.getState();
		state.status = this.status;
		return state;
	}

	loadTime() {
		return this
		.setOffset(Number(localStorage.getItem('TimerOffset')))
		.setStatus(this.offset ? 'manual' : 'system');
	}

	doStatus() {
		return this.emit('status', this.getState());
	}
}

export class SmartTimer extends PersistantTimer {
	constructor() {
		super();
		this.retrieveTime();
	}
	
	setTime(time) {
		return super.setTime(time).setMode('manual');
	}

	setMode(mode) {
		localStorage.setItem('TimerMode', mode);
		this.mode = mode;
		return this.doStatus();
	}
	
	autoTime() {
		return this.setMode('auto').retrieveTime();
	}
	
	getState() {
		var state = super.getState();
		state.mode = this.mode;
		return state;
	}

	loadTime() {
		return super.loadTime()
		.setMode(localStorage.getItem('TimerMode') || 'auto');
	}

	retrieveTime() {
		if (this.mode == 'auto')
			fetch('https://api.conclock.lladnaar.net/time')
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				this.setOffset((new Date(json.datetime)) - Date.now());
				this.setStatus('auto');
			}.bind(this))
			.catch(function (error) {
				this.setStatus('error');
			}.bind(this));
		return this;
	}
}
