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
	this.setLocale(this.site.project.default.locale)
}

/**
 * Helper function to set the locale.
 *
 * @param {string|number} locale - set locale by its name or alphabetical order
 */
Scope.prototype.setLocale = function setLocale(locale) {
	if (typeof locale == "undefined") {
		return
	}

	if (typeof locale == "number") {
		locale = Object.keys(this.site.locales)[locale]
	}

	this.locale = this.site.locales[locale]
	this.locale.code = locale
}

module.exports = Scope
