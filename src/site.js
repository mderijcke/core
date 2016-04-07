const EventEmitter = require("events").EventEmitter
const jadeRuntime = require("jade/runtime")
const mergePages = require("./pages").merge
const routington = require("routington")
const Scope = require("./scope")

global.jade = jadeRuntime

function Skira(source) {
	this.source = source

	this.modules = {}
	this.project = source.project
	this.locales = source.locales
	this.views = source.views

	this.pages = mergePages(source.pages, this.views)

	this.nav = this.importNav(source.nav)
	this.router = this.createRouter(this.pages)
}

Skira.prototype = Object.create(EventEmitter.prototype)

Skira.prototype.importNav = function importNav(nav) {
	var fresh = {}

	for (var navName in nav) {
		fresh[navName] = nav[navName]
			.map(pageName => this.pages[pageName])
	}

	return fresh
}

Skira.prototype.createRouter = function createRouter(pages) {
	var router = routington()

	for (var pageName in pages) {
		var page = pages[pageName]

		var routes = []
			.concat(page.href)
			.concat(page.routes)
			.filter(Boolean)

		routes
			.filter(url => url[0] == "/")
			.map(url => router.define(url))
			.forEach(node => node[0].page = page)
	}

	return router
}

Skira.prototype.runEvent = function runEvent(eventName, scope) {
	var queue = []

	this.emit(eventName, scope, queue)

	return Promise.all(queue)
}

Skira.prototype.init = async function init() {
	var tasks = Object.keys(this.source.modules || {})
		.map((name) => {
			var mod = this.source.modules[name]

			this.modules[name] = mod

			if (typeof mod.start == "function") {
				return mod.start.bind(mod, this)
			}
		})
		.filter(Boolean)

	await Promise.all(tasks)

	for (var moduleName in this.modules) {
		var module = this.modules[moduleName]

		if (module.hooks) {
			for (var hookName in module.hooks) {
				var handlers = [].concat(module.hooks[hookName])

				for (var handler of handlers) {
					this.on(hookName, handler)
				}
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

	if (scope.page._views) {
		for (var view of scope.page._views) {
			scope.content = view(scope)
		}
	}

	await this.runEvent("output", scope)

	if (typeof scope.content != "string" && !Buffer.isBuffer(scope.content)) {
		scope.content = JSON.stringify(scope.content)
	}

	if (!scope.headers["Content-Type"] && scope.content) {
		scope.headers["Content-Type"] = scope.content.length
	}

	return scope
}

module.exports = Skira
