const Sequelize = require('sequelize')
const sequelize = new Sequelize('truck', process.env.DB_USER, process.env.DB_PASS, {
	dialect: 'mysql',
	port: 3306,
	define: {
		underscored: false,
		freezeTableName: false,
		charset: 'utf8',
		dialectOptions: {
			collate: 'utf8_general_ci'
		},
		timestamps: true
	},
	sync: { force: true },
	pool: {
		max: 5,
		idle: 30000,
		acquire: 60000
	}
})

const ID_TYPE = Sequelize.STRING(50)
const generateId = () => {
	var random = require('crypto-random-string')({ length: 50, type: 'url-safe' })
	return random
}

function standardDefine(name, attributes) {
	var attrs = {}
	attrs.id = {
		type: ID_TYPE,
		primaryKey: true
	}
	Object.entries(attributes).map((entry) => {
		let key = entry[0],
			value = entry[1]
		if (typeof value === 'object' && value['primaryKey']) {
			delete attrs.id
		}
		if (typeof value === 'object' && value['type']) {
			value.allowNull = value.allowNull || false
			attrs[key] = value
		} else {
			attrs[key] = {
				type: value,
				allowNull: false
			}
		}
	})
	attrs.createdAt = {
		type: Sequelize.BIGINT,
		allowNull: false
	}
	attrs.updatedAt = {
		type: Sequelize.BIGINT,
		allowNull: false
	}
	attrs.version = {
		type: Sequelize.BIGINT,
		allowNull: false
	}
	return sequelize.define(name, attrs, {
		tableName: name,
		timestamps: false,
		hooks: {
			beforeValidate: function(obj) {
				let now = Date.now()
				if (obj.isNewRecord) {
					if (!obj.id) {
						obj.id = generateId()
					}
					obj.createdAt = now
					obj.updatedAt = now
					obj.version = 0
				} else {
					obj.updatedAt = Date.now()
					obj.version++
				}
			}
		}
	})
}

module.exports = {
	sequelize,
	standardDefine,
	...Sequelize
}
