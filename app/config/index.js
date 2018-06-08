var path = require('path')
var _ = require('lodash')
var fs = require('fs')

var all={
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname+`/../../..`),
    port: process.env.PORT || 3001,
    //mongodb配置
    mongo:{
    },
    //redis 配置
    redis:{
        host: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
        port: process.env.REDIS_PORT_6379_TCP_PORT || 6379,
        password: process.env.REDIS_PASSWORD || ''
    },
    //是否初始化数据
    seedDB: process.env.INITDATA || false,
    security:{
        jwt:{
            secrets: 'tate-secret',
        }
    },
    //用户角色种类
    userRoles:['user', 'admin'],
    //第三方登录配置
    weibo:{
        clientID: process.env.WEIBO_CLIENT_ID || 'clientID',
        clientSecret: process.env.WEIBO_CLIENT_SECRET || 'clientSecret',
        callbackURL: process.env.WEIBO_CALLBACK_URL || '',
    },
    qq:{
        clientID: process.env.QQ_CLIENT_ID || 'clientID',
        clientSecret: process.env.QQ_CLIENT_SECRET || 'clientSecret',
        callbackURL: process.env.QQ_CALLBACK_URL || '',
    },
    weixin:{
        clientID: process.env.QQ_CLIENT_ID || 'clientID',
        clientSecret: process.env.QQ_CLIENT_SECRET || 'clientSecret',
        callbackURL: process.env.QQ_CALLBACK_URL || '',
    },
    apps:[
        {
            name:'',
            downloadUrl:{
                android:'',
                ios:''
            },
            qrcode:{
                android:'',
                ios:''
            }
        }
    ],
    //开启第三方登录
    snsLogins:['weibo','qq']
}

var config = _.merge(all,require(`./env/${process.env.NODE_ENV}.js`) || {})

module.exports=config