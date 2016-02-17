var Promise = require("bluebird");

function Processor(site) {
	this.site = site;
}

Processor.prototype.render = function(data, request) {
	return Promise.try(function() {
		data.site = this.site;
		data.system = this.site; // shim for previous incarnation
		data.request = request;
		data.status = 200;
		data.headers = {};

		return Promise.all(data.site.emit("prepare", data));
	}).then(function() {
		var view = this.site.views[data.page.view];

		if (!view) {
			throw new Error("Could not load view: " + data.page.view);
		}

		data.content = view(data, this.site.viewRuntime);

		return Promise.all(data.site.emit("render", data));
	}).then(function() {
		if (data.page.master) {
			var master = this.site.views[data.page.master];
			data.content = master(data, this.site.viewRuntime);
		}
		
		return Promise.all(data.site.emit("output"));
	}).then(function() {
		return data;
	});
};

module.exports = Processor;
