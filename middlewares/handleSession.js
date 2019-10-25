const jwt = require('jsonwebtoken')
const handleSession = async (ctx, next) => {
	const session = ctx.session
	if (session.token) {
		const userInfo = jwt.decode(session.token)
		session.userInfo = userInfo
		await next()
	} else {
		ctx.status = 401
	}
}

module.exports = handleSession
