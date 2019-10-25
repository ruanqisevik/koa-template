const requireDirectory = require('require-directory'),
	blacklist = /common\.js$/
const routes = requireDirectory(module, { exclude: blacklist })
const middlewares = Object.values(routes).map((value) => value.middleware())

module.exports = {
	routes,
	middlewares
}
