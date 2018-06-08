const config = require('./config')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

mongoose.connect(config.mongo.uri)
const modelsPath = path.join(__dirname, 'model')
fs.readdirSync(modelsPath).forEach(function (file) {
	if (file!='mongo.js' && /(.*)\.(js$|coffee$)/.test(file)) {
		require(modelsPath + '/' + file)
	}
})
mongoose.Promise = global.Promise

module.exports = mongoose