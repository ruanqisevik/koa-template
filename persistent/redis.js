const redis = require('redis'),
	client = redis.createClient()
const { promisify } = require('util')
const asyncHashGetAll = promisify(client.hgetall).bind(client)

module.exports = {
	async get(key, maxAge, { rolling }) {
		const reply = await asyncHashGetAll(key)
		return reply
	},

	set(key, sess, maxAge, { rolling, changed }) {
		Object.entries(sess).map((entry) => {
			client.hset(key, entry[0], entry[1], redis.print)
		})
		client.pexpire(key, maxAge)
	},

	destroy(key) {
		client.del(key)
	}
}
