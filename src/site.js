const buildNav = require("./nav").buildNav
const createRouter = require("./router").create
const EventEmitter = require("events").EventEmitter
const isBuffer = require("is-buffer")
const mergePages = require("./pages").merge
const Scope = require("./scope")

function Skira(source) {
	this.source = source

	this.project = source.project
	this.locales = source.locales
	this.views = source.views
	this.pages = mergePages(source.pages)
	this.router = createRouter(this.pages)
	this.nav = buildNav(this.pages)
	this.modules = this.importModules(this.source.modules)

	if (!this.locales.default) {
		this.locales.default = Object.values(this.locales)[0]
	}

	this.mountViews()
}

Skira.prototype = Object.create(EventEmitter.prototype)

Skira.prototype.mountViews = function mountViews() {
	for (var page of Object.values(this.pages)) {
		page._views = []

		if (page.hasOwnProperty("view")) {
			var views = page._chain
				.map(page => page.view)
				.filter(Boolean)
				.map(viewName => this.views[viewName])
				.filter(Boolean)

			page._views = views
		}
	}
}

Skira.prototype.runEvent = async function runEvent(eventName, scope) {
	var queue = []

	this.emit(eventName, scope, queue)

	await Promise.all(queue)
}

Skira.prototype.importModules = function importModules(wrappedModules) {
	var out = {}

	for (var key in wrappedModules) {
		var fn = wrappedModules[key]
		var unwrappedModule = fn()
		out[key] = Object.create(unwrappedModule)
	}

	return out
}

Skira.prototype.init = async function init() {
	var tasks = Object.values(this.modules)
		.map((mod) => {
			// Use bind so that we don't start executing anything
			// in this .map function. Let Promise.all run them all.
			if (typeof mod.start == "function") {
				return mod.start.bind(mod, this)
			}
		})

	await Promise.all(tasks)

	for (var module of Object.values(this.modules)) {
		for (var hookName in module.hooks || {}) {
			var handlers = [].concat(module.hooks[hookName])

			for (var handler of handlers) {
				this.on(hookName, handler)
			}
		}
	}
}

Skira.prototype.resolve = function request(url) {
	var match = this.router.match(url)

	if (!match || !match.node || !match.node.page) {
		return
	}

	return new Scope(this, match.node.page, match.param)
}

Skira.prototype.process = async function process(scope) {
	await this.runEvent("prepare", scope)
	await this.runEvent("render", scope)

	for (var view of scope.page._views) {
		scope.content = view(scope)
	}

	await this.runEvent("output", scope)

	if (typeof scope.content != "string" && !isBuffer(scope.content)) {
		scope.content = JSON.stringify(scope.content)
	}

	if (!scope.header("Content-Length") && scope.content) {
		scope.header("Content-Length", scope.content.length)
	}

	return scope
}

module.exports = Skira
