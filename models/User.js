const db = require('../utils/db')

module.exports = db.standardDefine('user', {
	uid: {
		type: db.STRING(20),
		unique: true,
		primaryKey: true
	},
	mobile: {
		type: db.STRING(11),
		unique: true
	},
	name: {
		type: db.STRING(100),
		defaultValue: ''
	},
	sex: {
		type: db.ENUM('male', 'female', 'unknown'),
		defaultValue: 'unknown'
	},
	avatar: {
		type: db.STRING,
		defaultValue: ''
	}
})
