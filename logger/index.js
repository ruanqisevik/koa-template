const winston = require('winston')
const path = require('path')

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new winston.transports.Console(), new winston.transports.File({ filename: path.resolve('../logs') })
	]
})

module.exports = logger
