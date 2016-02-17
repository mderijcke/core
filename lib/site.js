var EventEmitter = require("eventemitter3-collector");

function Site(base) {
	if (typeof base == "object") {
		for (var i in base) {
			this[i] = base[i];
		}
	}
}

Site.prototype = new EventEmitter();

module.exports = Site;
