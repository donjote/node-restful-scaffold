const passport = require('koa-passport')
const auth = require('../auth.service')
const logger = require('../../../util/logs')
const Router = require("koa-router")
const router = new Router()

router
    .get('/weixin',auth.snsPassport(),passport.authenticate('weixin',{
        successRedirect:'/',
        failureRedirect: '/'
    }))
    .get('/scan',auth.snsPassport(),passport.authenticate('weixinClient',{
        successRedirect:'/',
        failureRedirect: '/'
    }))
    .get('/callback',async(ctx,next)=>{
        await passport.authenticate('weixin',{session:false},function(err,user,redirectURL){
            logger.debug('weibo auth callback start')
            let snsmsg={}
            if(err || !user){
                ctx.status = 403
                return ctx.body = err
            }

            const token = auth.signToken(user._id)
            ctx.body = {token: token}
        })(ctx)
    })

module.exports = router