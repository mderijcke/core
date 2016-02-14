function Processor(site) {
	this.site = site;
}

Processor.prototype.render = function(data, request) {
	data.site = this.site;
	data.system = this.site; // shim for previous incarnation
	data.request = request;
	data.status = 200;
	data.headers = {};

	// TODO: build an actual system for this
	data.locale = this.site.locales[Object.keys(this.site.locales)[0]];

	data.headers["Connection"] = "close";
	data.headers["Content-Type"] = "text/html; charset=utf-8";

	var view = this.site.views[data.page.view];

	if (!view) {
		throw new Error("Could not load view: " + data.page.view);
	}

	data.content = view(data, this.site.viewRuntime);

	if (data.page.master) {
		var master = this.site.views[data.page.master];
		data.content = master(data, this.site.viewRuntime);
	}

	return data;
};

module.exports = Processor;
