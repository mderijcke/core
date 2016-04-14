/**
 * The state object are all variables made available to views and modules.
 *
 * @param {object} site - global Skira site
 * @param {object} page - resolved page
 * @param {object} params - params parsed by the router
 */
function Scope(site, page, params) {
	this.site = site
	this.page = page
	this.params = params || {}
	this.status = 200
	this._headers = {}
	this.locale = site.locales.default

	// Set default headers.
	this.header("Content-Type", "text/html; charset=utf-8")
	this.header("Connection", "close")
	this.header("Server", "Skira")
}

Scope.prototype.header = function getOrSetHeader(name, value) {
	name = name.toLowerCase()

	if (typeof value == "undefined") {
		return this._headers[name]
	}

	this._headers[name] = "" + value
}

module.exports = Scope
