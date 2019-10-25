const handleInvalid = async (ctx, next) => {
	if (ctx.invalid) {
		ctx.status = 400
		ctx.body = {
			err: ctx.invalid.body,
			msg: ctx.invalid.body.msg
		}
	} else {
		await next()
	}
}

module.exports = handleInvalid
