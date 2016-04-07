# skira-core

Wrapper around Skira sites for full initialization, url resolving and request processing.

[![NPM Version][npm-image]][npm-url]
[![Dependency Status][deps-image]][deps-url]
[![devDependency Status][devdeps-image]][devdeps-url]
[![License][license-image]][license-url]
[![Chat][chat-image]][chat-url]

## Status

Skira is still in active development. We are working towards a final release ASAP (1.0.0) and will then keep the API stable.

## Example

```js
const Site = require("skira-core")

var siteData = require(process.cwd() + "/build/site")
var site = new Site(siteData)

var scope = site.resolve("/")

site.process(scope).then((scope) => {
    console.log(scope.content)
})
```

## Contributing

We recommend installing the ESLint and JSCS plugins into your editor to instantly check your code against the guidelines. This will make pull requests easier for everyone.

[npm-image]: https://img.shields.io/npm/v/skira-core.svg
[npm-url]: https://npmjs.org/package/skira-core
[deps-image]: https://img.shields.io/david/skira-project/core.svg
[deps-url]: https://david-dm.org/skira-project/core
[devdeps-image]: https://img.shields.io/david/dev/skira-project/core.svg
[devdeps-url]: https://david-dm.org/skira-project/core#info=devDependencies
[license-image]: https://img.shields.io/github/license/skira-project/core.svg
[license-url]: LICENSE
[chat-image]: https://img.shields.io/gitter/room/skira-project/skira.svg
[chat-url]: https://gitter.im/skira-project/skira
