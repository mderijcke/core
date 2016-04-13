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
	this.headers = {
		"Content-Type": "text/html; charset=utf-8",
		Connection: "close",
		Server: "Skira",
	}
	this.locale = site.locales.default
}

module.exports = Scope
