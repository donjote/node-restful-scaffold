const passport = require('koa-passport')
const auth = require('../auth.service')
const logger = require('../../../util/logs')
const Router = require("koa-router")
const router = new Router()

router
    .get('/',auth.snsPassport(),passport.authenticate('qq',{
        failureRedirect: '/',
        session: false
    }))
    .get('/callback',async(ctx,next)=>{
        await passport.authenticate('qq',{session:false},function(err,user,redirectURL){
            logger.debug('qq auth callback start')
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