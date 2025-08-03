Element.prototype.on = Element.prototype.addEventListener;
Element.prototype.off = Element.prototype.removeEventListener;
Element.prototype.once = function (event, listener) {
	this.addEventListener(event, function onlyOnce(e) {
		e.target.removeEventListener(e.type, onlyOnce);
		return listener(e);
	});
}
