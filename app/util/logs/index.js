const bunyan = require('bunyan')

const logger = bunyan.createLogger({
	name: 'tate',
	serializers: {
	 req: bunyan.stdSerializers.req,
	 res: bunyan.stdSerializers.res,
	 err: bunyan.stdSerializers.err
	},
	streams: [
		{
			level: 'INFO',
			stream: process.stdout
		}
	]
})

module.exports = logger