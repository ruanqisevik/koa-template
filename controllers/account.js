const random = require('crypto-random-string')

const models = require('../models/index')
const Account = models.Account

const processError = require('./error')
const logger = require('../logger')

const jwt = require('jsonwebtoken')

const generateUid = () => {
	var date = Date.now()
	return `${date}${random({ length: 7, characters: '1234567890' })}`
}

const register = async (ctx, next) => {
	const res = ctx.response
	try {
		var { account, passwd, uid } = ctx.request.body
		if (!uid) {
			uid = generateUid()
		}
		const result = await Account.findOrCreate({
			where: { uid },
			defaults: {
				uid,
				account,
				passwd
			}
		})
		const ifExist = !result[1]
		if (!ifExist) {
			res.status = 200
			res.body = {
				status: 200,
				data: result[0].dataValues,
				msg: '创建账户成功'
			}
		} else {
			res.status = 200
			res.body = {
				status: 200,
				data: result[0].dataValues,
				msg: '账户已存在'
			}
		}
	} catch (error) {
		logger.error(error)
		res.status = 200
		res.body = {
			status: processError.USER_CREATE_ERROR_CODEd,
			msg: processError.USER_CREATE_ERROR_MSG
		}
	}
}

const login = async (ctx, next) => {
	const res = ctx.response
	const session = ctx.session
	try {
		var { account, passwd } = ctx.request.body

		const result = await Account.findOne({
			where: { account, passwd }
		})

		if (!result) {
			res.status = 200
			res.body = {
				status: 200,
				msg: '用户不存在'
			}
		} else {
			session.token = jwt.sign(result.dataValues, 'truck-repairing')
			res.status = 200
			res.body = {
				status: 200,
				data: result.dataValues,
				msg: '操作成功'
			}
		}
	} catch (error) {
		res.status = 200
		res.body = {
			status: processError.ACCOUNT_LOGIN_ERROR_CODE,
			msg: processError.ACCOUNT_LOGIN_ERROR_MSG
		}
	}
}

module.exports = {
	register,
	login
}
