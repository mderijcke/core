const assert = require("assert")
const Site = require("../../")
const siteData = require("../../samples/_site")

describe("Basic use", () => {
	it("does not error", () => {
		let site = new Site(siteData)
		let unused = true

		describe("Valid request scope", () => {
			let scope = site.resolve("/")

			it("should be an object", () => {
				assert(typeof scope == "object")
			})

			it("should have a page defined", () => {
				assert(typeof scope.page != "undefined")
			})

			it("should allow headers to be read and set", () => {
				let headerName = "X-Test-Header"
				let headerValue = "MagicValue" + Math.random()

				scope.header(headerName, headerValue)

				assert(scope.header(headerName) == headerValue)
			})
		})

		describe("Unknown URL scope", () => {
			it("should be undefined", () => {
				let scope = site.resolve("/nosuchthing" + Math.random())

				assert(typeof scope == "undefined")
			})
		})

		// routes
	})
})

// await site.process(scope)
// check content length
