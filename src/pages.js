const merge = require("merge")

function getExtends(pages, pageName) {
	var out = []

	while (pageName) {
		var page = pages[pageName]

		if (!page) {
			throw new Error("Could not find page to extend: " + pageName)
		}

		// make sure we're not making circular chains
		var duplicateIndex = out.indexOf(pageName)

		out.push(pageName)

		// check for the actual value AFTER pushing so the chain in the
		// error message actually makes sense
		if (duplicateIndex != -1) {
			throw new Error("Circular extend: " + out.join(" -> "))
		}

		// if the page has not defined where to extend from the while
		// loop while stop by encountering undefined
		pageName = page.extends
	}

	// Output an array of page objects. We can't do this right away because
	// then we can't easily find circular extensions.
	return out.map(pageName => pages[pageName])
}

function mergePage(chain) {
	var currentPageLast = chain.slice()

	currentPageLast.reverse()

	var args = [].concat(true).concat(currentPageLast)

	return merge.recursive.apply(merge, args)
}

function mergePages(pages, views) {
	var fresh = {}

	for (var pageName in pages) {
		var chain = getExtends(pages, pageName)

		if (chain[0].view) {
			chain[0]._views = chain
				.map(p => p.view)
				.filter(Boolean)
				.map(viewName => views[viewName])
				.filter(Boolean)
		}

		fresh[pageName] = mergePage(chain)
	}

	return fresh
}

module.exports.merge = mergePages
