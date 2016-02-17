var Promise = require("bluebird");

function Processor(site) {
	this.site = site;
}

Processor.prototype.runEvent = function(eventName, data) {
	var output = data.site.emit(eventName, data);

	if (Array.isArray(output)) {
		return Promise.all(output);
	}

	return Promise.join(output);
};

Processor.prototype.render = function(data, request) {
	var _this = this;

	return Promise.try(function() {
		data.site = _this.site;
		data.system = _this.site; // shim for previous incarnation
		data.request = request;
		data.status = 200;
		data.headers = {};

		return this.runEvent("prepare", data);
	}).then(function() {
		var view = _this.site.views[data.page.view];

		if (!view) {
			throw new Error("Could not load view: " + data.page.view);
		}

		data.content = view(data, _this.site.viewRuntime);

		return this.runEvent("render", data);
	}).then(function() {
		if (data.page.master) {
			var master = _this.site.views[data.page.master];
			data.content = master(data, _this.site.viewRuntime);
		}
		
		return runEvent("output", data);
	}).then(function() {
		return data;
	});
};

module.exports = Processor;
