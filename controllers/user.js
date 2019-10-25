const models = require('../models/index')
const User = models.User

const processError = require('./error')
const logger = require('../logger')

const upsertUser = async (ctx, next) => {
	const res = ctx.response
	const session = ctx.session
	try {
		var { name, mobile, sex, avatar } = ctx.request.body
		var { uid } = session.userInfo
		const result = await User.findOrCreate({
			where: { uid },
			defaults: {
				uid,
				name,
				mobile,
				sex,
				avatar
			}
		})
		const ifExist = !result[1]
		if (!ifExist) {
			res.status = 200
			res.body = {
				status: 200,
				data: result[0].dataValues,
				msg: '新增用户成功'
			}
		} else {
			res.status = 200
			res.body = {
				status: 200,
				data: result[0].dataValues,
				msg: '更新用户成功'
			}
		}
	} catch (error) {
		logger.error(error)
		res.status = 200
		res.body = {
			status: processError.USER_CREATE_ERROR_CODE,
			msg: processError.USER_CREATE_ERROR_MSG
		}
	}
}

const listUsers = async (ctx) => {
	const res = ctx.response
	try {
		const { pageNum, pageSize } = ctx.request.body
		const result = await User.findAndCountAll({
			attributes: {
				exclude: ['version']
			},
			where: {},
			offset: (pageNum - 1) * pageSize,
			limit: pageSize
		})
		res.status = 200
		res.body = {
			status: 200,
			msg: '获取用户列表成功',
			data: result
		}
	} catch (error) {
		logger.error(error)
		res.status = 200
		res.body = {
			status: processError.USER_CREATE_ERROR_CODE,
			msg: processError.USER_CREATE_ERROR_MSG
		}
	}
}

const removeUser = async (ctx) => {
	const res = ctx.response
	try {
		const { uid } = ctx.request.body
		const result = await User.destroy({
			where: { uid }
		})
		if (result === 1) {
			res.status = 200
			res.body = {
				status: 200,
				msg: '移除用户成功',
				data: result
			}
		} else if (result === 0) {
			res.status = 200
			res.body = {
				status: processError.USER_REMOVE_NOTFIND_CODE,
				msg: processError.USER_REMOVE_NOTFIND_MSG
			}
		}
	} catch (error) {
		logger.error(error)
		res.status = 200
		res.body = {
			status: processError.USER_REMOVE_ERROR_CODE,
			msg: processError.USER_REMOVE_ERROR_MSG
		}
	}
}

module.exports = {
	upsertUser,
	listUsers,
	removeUser
}
