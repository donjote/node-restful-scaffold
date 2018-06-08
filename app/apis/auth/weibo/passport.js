const passport = require('koa-passport')
const weiboStrategy = require('passport-weibo').Strategy
const tools = require('../../../util/tools')
const config = require('../../../config')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.setup = function(){
    passport.use(new weiboStrategy({
        clientID: config.weibo.clientID,
        clientSecret: config.weibo.clientSecret,
        callbackURL: config.weibo.callbackURL,
        passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done)=> {
        try {
            const checkUserId = await User.findOne({'qq.id': profile.id})
            if(checkUserId) return done(null, checkUserId)
            let newUser = {
              nickname: profile.displayName || profile.username,
              avatar:profile._json.avatar_large || '',
              weibo: profile._json,
            }
            const checkUserName = await User.findOne({nickname:newUser.nickname})
            if(checkUserName){
              newUser.nickname = tools.randomString()
            }
            const user = await new User(newUser).save()
            return done(null, user)       
          } catch (err) {
            logger.debug('weiboStrategy error')
            return done(err)       
          }
    }))
}