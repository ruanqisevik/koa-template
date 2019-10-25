const joiRouter = require('koa-joi-router')
const Joi = joiRouter.Joi
const router = joiRouter()
const handleInvalid = require('../middlewares/handleInvalid')
const Account = require('../controllers/account')
const commonValidates = require('./common').validates

router.prefix('/account')

router.route({
	method: 'post',
	path: '/register',
	validate: {
		...commonValidates,
		body: {
			account: Joi.string()
				.min(6)
				.max(40)
				.required(),
			passwd: Joi.string()
				.min(8)
				.max(20)
				.required(),
			confirmPasswd: Joi.string()
				.min(8)
				.max(20)
				.valid(Joi.ref('passwd'))
				.required()
		}
	},
	handler: [handleInvalid, Account.register]
})

router.route({
	method: 'post',
	path: '/login',
	validate: {
		...commonValidates,
		body: {
			account: Joi.string()
				.min(6)
				.max(40)
				.required(),
			passwd: Joi.string()
				.min(8)
				.max(20)
				.required()
		}
	},
	handler: [handleInvalid, Account.login]
})

module.exports = router
