export class Time {
	static part(x) {
		return (x < 10 ? '0' : '') + x;
	}

	static HMS(time) {
		return Time.part(time.getHours()) + ':' + Time.part(time.getMinutes()) + ':' + Time.part(time.getSeconds());
	}

	static HM(time) {
		return Time.part(time.getHours()) + ':' + Time.part(time.getMinutes());
	}

	static HMSX(time) {
		return (time.getHours() % 12) + ':' + Time.part(time.getMinutes()) + ':' + Time.part(time.getSeconds()) + ' ' + (time.getHours()<12 ? 'AM' : 'PM');
	}

	static HMX(time) {
		return (time.getHours() % 12) + ':' + Time.part(time.getMinutes()) + ' ' + (time.getHours()<12 ? 'AM' : 'PM');
	}
}

export class Duration {
	static HMS(time) {
		return time.getHours() + 'h ' + time.getMinutes() + 'm ' + time.getSeconds() + 's';
	}

	static HM(time) {
		return time.getHours() + 'h ' + time.getMinutes() + 'm';
	}

	static MS(time) {
		return (time.getHours() * 60 + time.getMinutes()) + 'm ' + time.getSeconds() + 's';
	}

	static M(time) {
		return (time.getHours() * 60 + time.getMinutes()) + 'm';
	}
}
