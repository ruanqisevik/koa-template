const db = require('../utils/db')

module.exports = db.standardDefine('account', {
	uid: {
		type: db.STRING(20),
		unique: true,
		primaryKey: true
	},
	account: {
		type: db.STRING(40),
		unique: true
	},
	passwd: {
		type: db.STRING(100),
		defaultValue: ''
	}
})
