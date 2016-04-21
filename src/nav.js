module.exports.buildNav = function buildNav(pages) {
	let nav = {}

	for (let page of Object.values(pages)) {
		if (!page.navorder) {
			continue
		}

		for (let navName in page.navorder) {
			if (typeof nav[navName] == "undefined") {
				nav[navName] = []
			}

			nav[navName].push(page)
		}
	}

	for (let name in nav) {
		nav[name].sort((p1, p2) => p1.navorder[name] - p2.navorder[name])
	}

	return nav
}
