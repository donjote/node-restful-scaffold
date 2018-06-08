const passport = require('koa-passport')
const qqStrategy =require('passport-qq').Strategy
const tools = require('../../../util/tools')
const config = require('../../../config')
const logger = require('../../../util/logs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.setup = function(){
    passport.use(new qqStrategy({
        clientID: config.qq.clientID,
        clientSecret: config.qq.clientSecret,
        callbackURL: config.qq.callbackURL,
        passReqToCallback: true
    },
    async(req, accessToken, refreshToken, profile, done)=>{
        try {
            const checkUserId = await User.findOne({'qq.id': profile.id})
            if(checkUserId) return done(null, checkUserId)
            let newUser = {
              nickname: profile._json.nickname || '',
              avatar:profile._json.figureurl_qq_2 || profile._json.figureurl_2 || '',
              qq: {
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
            logger.debug('qqStrategy error')
            return done(err)       
          }
    }))
}