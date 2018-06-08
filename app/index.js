const Koa = require('koa')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const cors = require('kcors')
const compress = require('koa-compress')
const passport = require('koa-passport')
const config = require('./config')
const fs = require('fs')
const logger = require('./util/logs')
const mongoose = require('./connect')
const router = require('./router')
const app = new Koa()

// 初始化数据
if(config.seedDB) { 
	const initData = require('./config/seed') 
	initData()
}

app
    .use(cors({
        credentials: true
    }))
    .use(koaLogger())
    .use(bodyParser())
    .use(json())
    .use(compress())
    .use(passport.initialize())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.port,function(){
        logger.info(`服务器启动并监听端口${config.port}`)
    })