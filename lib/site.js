var EventEmitter = require("eventemitter3-collector");

function Site() {
}

Site.prototype = new EventEmitter();

module.exports = Site;
