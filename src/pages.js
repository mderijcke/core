const deepmerge = require("deepmerge")

function getExtends(pages, pageName) {
	let out = []

	while (pageName) {
		let page = pages[pageName]

		if (!page) {
			throw new Error("Could not find page to extend: " + pageName)
		}

		// make sure we're not making circular chains
		let duplicateIndex = out.indexOf(pageName)

		// check for the actual value AFTER pushing so the chain in the
		// error message actually makes sense
		out.push(pageName)

		if (duplicateIndex != -1) {
			throw new Error("Circular extend: " + out.join(" -> "))
		}

		pageName = page.extends
	}

	// Output an array of page objects. We can't do this right away because
	// then we can't easily find circular extensions due to indexOf working
	// with keys, which are strings.
	return out.map((pageName) => pages[pageName])
}

function mergeMultiple(objects) {
	// Merge every page, skipping the first (dummy) call.
	return objects.reduce((prev, curr) => prev ? deepmerge(prev, curr) : curr, false)
}

function mergePages(pages) {
	let fresh = {}

	for (let pageName in pages) {
		let page = pages[pageName]
		let chain = getExtends(pages, pageName)
		let proto = mergeMultiple(chain.slice(1).reverse()) || {}

		proto._name = pageName
		proto._chain = chain

		let newPage = Object.create(proto)

		for (let key in page) {
			newPage[key] = page[key]
		}

		fresh[pageName] = newPage
	}

	return fresh
}

module.exports.merge = mergePages
