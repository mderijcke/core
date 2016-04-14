const routington = require("routington")

module.exports.create = function createRouter(pages) {
	var router = routington()

	for (var pageName in pages) {
		var page = pages[pageName]

		;[]
			.concat(page.href)
			.concat(page.routes)
			.filter(url => typeof url == "string" && url[0] == "/")
			.map(url => router.define(url))
			.forEach(node => node[0].page = page)
	}

	return router
}
