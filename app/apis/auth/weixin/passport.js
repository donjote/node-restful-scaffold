const passport = require('koa-passport')
const weixinStrategy = require('passport-weixin').Strategy
const tools = require('../../../util/tools')
const config = require('../../../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.setup=function(){
    passport.use('weixin',new weixinStrategy({
        clientID:config.weixin.clientID,
        clientSecret:config.weixin.clientSecret,
        callbackURL:config.weixin.callbackURL,
        requireState: false,
        scope: 'snsapi_login'
    },
    async (accessToken, refreshToken, profile, done)=>{
        try {
            const checkUserId = await User.findOne({'weixin.id': profile.id})
            if(checkUserId) return done(null, checkUserId)
            let newUser = {
              nickname: profile._json.nickname || '',
              avatar:profile._json.headimgurl || '',
              weixin: {
                  id: profile.id,
                  name: profile._json.nickname || '',
                  email: ''
              }
            }
            const checkUserName = await User.findOne({nickname:newUser.nickname})
            if(checkUserName){
              newUser.nickname = tools.randomString()
            }
            const user = await new User(newUser).save()
            return done(null, user)       
          } catch (err) {
            logger.debug('weixinStrategy error')
            return done(err)       
          }
    }))

    passport.use('weixinClient',new weixinStrategy({
        clientID:config.weixin.clientID,
        clientSecret:config.weixin.clientSecret,
        callbackURL:config.weixin.callbackURL,
        requireState: false,
        authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize', //[公众平台-网页授权获取用户基本信息]的授权URL 不同于[开放平台-网站应用微信登录]的授权URL
        scope: 'snsapi_userinfo' //[公众平台-网页授权获取用户基本信息]的应用授权作用域 不同于[开放平台-网站应用微信登录]的授权URL
    },
    async (accessToken, refreshToken, profile, done)=>{
        try {
            const checkUserId = await User.findOne({'weixin.id': profile.id})
            if(checkUserId) return done(null, checkUserId)
            let newUser = {
              nickname: profile._json.nickname || '',
              avatar:profile._json.headimgurl || '',
              weixin: {
                  id: profile.id,
                  name: profile._json.nickname || '',
                  email: ''
              }
            }
            const checkUserName = await User.findOne({nickname:newUser.nickname})
            if(checkUserName){
              newUser.nickname = tools.randomString()
            }
            const user = await new User(newUser).save()
            return done(null, user)       
          } catch (err) {
            logger.debug('weixinStrategy error')
            return done(err)       
          }
    }))
}