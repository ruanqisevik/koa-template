const joiRouter = require('koa-joi-router')
const Joi = joiRouter.Joi
const router = joiRouter()
const handleInvalid = require('../middlewares/handleInvalid')
const handleSession = require('../middlewares/handleSession')
const user = require('../controllers/user')

const commonUserValidatesBody = {
	mobile: Joi.string()
		.length(11)
		.required(),
	name: Joi.string()
		.max(100)
		.default(''),
	sex: Joi.string()
		.valid('male', 'female', 'unknown')
		.default('unknown'),
	avatar: Joi.string()
		.uri({})
		.default('')
}
const commonUserValidates = {
	type: 'json',
	body: commonUserValidatesBody,
	continueOnError: true
}

router.prefix('/users')

router.post('/view', function(ctx, next) {
	ctx.body = 'this is a users response!'
})

router.route({
	method: 'post',
	path: '/list',
	validate: {
		...commonUserValidates,
		body: {
			pageSize: Joi.number()
				.positive()
				.required(),
			pageNum: Joi.number()
				.positive()
				.required()
		}
	},
	handler: [handleInvalid, user.listUsers]
})

router.route({
	method: 'post',
	path: '/insert',
	validate: commonUserValidates,
	handler: [handleInvalid, handleSession, user.upsertUser]
})

router.route({
	method: 'post',
	path: '/update',
	validate: commonUserValidatesBody,
	handler: [handleInvalid, handleSession, user.upsertUser]
})

router.route({
	method: 'post',
	path: '/remove',
	validate: {
		...commonUserValidates,
		body: {
			uid: Joi.string()
				.length(20)
				.required()
		}
	},
	handler: [handleInvalid, user.removeUser]
})

module.exports = router
