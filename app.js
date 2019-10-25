const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const routes = require('./routes').middlewares
const compose = require('koa-compose')

const session = require('koa-session')
const redisStore = require('./persistent/redis')
// error handler
onerror(app)
app.keys = ['test app key']
// middlewares
const sessionConfig = {
	key: 'koa:sess' /** (string) cookie key (default is koa:sess) */,
	/** (number || 'session') maxAge in ms (default is 1 days) */
	/** 'session' will result in a cookie that expires when session/browser is closed */
	/** Warning: If a session cookie is stolen, this cookie will never expire */
	maxAge: 24 * 60 * 60 * 1000,
	overwrite: true /** (boolean) can overwrite or not (default true) */,
	httpOnly: true /** (boolean) httpOnly or not (default true) */,
	signed: true /** (boolean) signed or not (default true) */,
	rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
	renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
	store: redisStore
}
app.use(session(sessionConfig, app))

app.use(
	bodyparser({
		enableTypes: ['json', 'form', 'text']
	})
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(compose(routes))

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
})

module.exports = app
