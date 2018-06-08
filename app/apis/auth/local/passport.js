const passport = require('koa-passport')
const mongoose = require('mongoose')
const LocalStrategy =require('passport-local').Strategy
const logger = require('../../../util/logs')


exports.setup = function(){
    passport.use(new LocalStrategy({
        usernameField:'mobile',
        passwordField:'password'
    },
    async (mobile,password,done)=>{
        try{
            let user = await mongoose.model('User').findOne({mobile:mobile})
            if(!user){
                logger.error('登录用户名错误',{'username':mobile})
                return done(null, false, { error: '用户名或密码错误.' })
            }
        
            if (!user.authenticate(password)) {
                logger.error('登录密码错误',{'username':mobile})
                return done(null, false, { error_msg: '用户名或密码错误.' })
            }
            if(user.locked){
                logger.error('被阻止登录', {'username':mobile})
                return done(null, false, { error_msg: '用户被阻止登录.' })
            }
            return done(null, user)
        } catch (err) {
            logger.debug('LocalStrategy error')
            return done(err) 
        }
    }
    ))
}