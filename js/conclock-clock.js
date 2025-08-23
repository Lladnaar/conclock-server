import * as common from './common.js';
import * as timer from './timer.js';
import * as format from './format.js';

window.addEventListener("load", initialisePage);

function initialisePage() {
	var smarttimer = new timer.SmartTimer();
	var clock = new Clock(smarttimer);
	var settings = new Settings(smarttimer, clock);
}

class Clock {
	constructor(timer) {
		// objects
		this.timer = timer;
		// elements
		this.clock = document.getElementById("clock");
		// state
		this.setFormat(localStorage.getItem('ClockFormat') || 'HM');
		// events
		this.timer.on("tick", this.update.bind(this));
	}
	
	draw() {
		this.clock.textContent = Clock.formatters[this.format](this.time || new Date(0));
		return this;
	}
	
	update(event) {
		this.time = event.time;
		return this.draw();
	}
	
	setFormat(format) {
		localStorage.setItem('ClockFormat', format);
		this.format = format;
		return this.draw();
	}
	
	getFormat() {
		return this.format;
	}
}

Clock.formatters = {
	'default': format.Time.HM,
	'HMS':	   format.Time.HMS,
	'HM':	   format.Time.HM,
	'HMSX':	   format.Time.HMSX,
	'HMX':	   format.Time.HMX
};

class Settings {
	constructor(timer, clock) {
		// objects
		this.timer = timer;
		this.clock = clock;
	
		// elements
		this.settings = document.getElementById("settings");
		this.year = document.getElementById("year");
		this.month = document.getElementById("month");
		this.day = document.getElementById("day");
		this.hour = document.getElementById("hour");
		this.minute = document.getElementById("minute");
		this.second = document.getElementById("second");
		this.close = document.getElementById("close");
		this.auto = document.getElementById("auto");
		this.status = document.getElementById("status");
		this.format = document.getElementById("format");

		// state
		this.settings.hidden = true;
		this.setFormat(this.clock.getFormat());
		this.updateTime(this.timer.getState());
		this.updateStatus(this.timer.getState());

		// object events
		this.timer.on("tick", this.updateTime.bind(this));
		this.timer.on("status", this.updateStatus.bind(this));

		// user events
		document.body.on("keypress", this.hotKey.bind(this));
		this.year.on("change", this.changeTime.bind(this));
		this.month.on("change", this.changeTime.bind(this));
		this.day.on("change", this.changeTime.bind(this));
		this.hour.on("change", this.changeTime.bind(this));
		this.minute.on("change", this.changeTime.bind(this));
		this.second.on("change", this.changeTime.bind(this));
		this.close.on("click", this.hide.bind(this));
		this.auto.on("click", this.setAuto.bind(this));
		this.format.on("change", this.changeFormat.bind(this));
	}

	setAuto(event) {
		this.timer.autoTime();
	}

	hotKey(event) {
		if (this.settings.hidden && event.key == "Escape") {
			this.show();
			event.stopPropagation();
		}
		else if (!this.settings.hidden && event.key == "Escape") {
			this.hide();
			event.stopPropagation();
		}
	}
	
	show() {
		document.activeElement.blur();
		this.settings.hidden = false;
	}
	
	hide() {
		document.activeElement.blur();
		this.settings.hidden = true;
	}

	displayTimeExcept(time, except) {
		if (except != "year") 
			this.year.value = time.getFullYear();
		if (except != "month") 
			this.month.value = format.Time.part(time.getMonth() + 1);
		if (except != "day") 
			this.day.value = format.Time.part(time.getDate());
		if (except != "hour") 
			this.hour.value = format.Time.part(time.getHours());
		if (except != "minute") 
			this.minute.value = format.Time.part(time.getMinutes());
		if (except != "second") 
			this.second.value = format.Time.part(time.getSeconds());
	}

	standardiseTime(time) {
		this.displayTimeExcept(time, null);
	}

	updateTime(time) {
		this.displayTimeExcept(time.time, document.activeElement.id);
	}

	updateStatus(status) {
		if (status.mode == 'auto')
			if (status.status == 'auto')
				this.status.className = 'green';
			else
				this.status.className = 'orange';
		else
			this.status.className = 'red';
	}

	changeTime(event) {
		var current = this.timer.getTime();
		var time = new Date(
			event.target.id=="year" ? this.year.value : current.getFullYear(),
			event.target.id=="month" ? this.month.value - 1 : current.getMonth(),
			event.target.id=="day" ? this.day.value : current.getDate(),
			event.target.id=="hour" ? this.hour.value : current.getHours(),
			event.target.id=="minute" ? this.minute.value : current.getMinutes(),
			event.target.id=="second" ? this.second.value : current.getSeconds(),
			current.getMilliseconds()
		);
		this.timer.setTime(time);
		this.standardiseTime(time);
	}

	setFormat(format) {
		this.format.value = format;
	}

	changeFormat(event) {
		this.clock.setFormat(this.format.value);
	}
}
