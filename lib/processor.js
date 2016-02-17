var Promise = require("bluebird");

function Processor(site) {
	this.site = site;
}

Processor.prototype.render = function(data, request) {
	var _this = this;

	return Promise.try(function() {
		data.site = _this.site;
		data.system = _this.site; // shim for previous incarnation
		data.request = request;
		data.status = 200;
		data.headers = {};

		return Promise.all(_this.site.emit("prepare", data));
	}).then(function() {
		var view = _this.site.views[data.page.view];

		if (!view) {
			throw new Error("Could not load view: " + data.page.view);
		}

		data.content = view(data, _this.site.viewRuntime);

		return Promise.all(_this.site.emit("render", data));
	}).then(function() {
		if (data.page.master) {
			var master = _this.site.views[data.page.master];
			data.content = master(data, _this.site.viewRuntime);
		}
		
		return Promise.all(_this.site.emit("output"));
	}).then(function() {
		return data;
	});
};

module.exports = Processor;
