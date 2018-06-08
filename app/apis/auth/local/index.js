const passport = require('koa-passport')
const auth = require('../auth.service')
const Router = require("koa-router")
const router = new Router()

function checkCaptcha(){
    return async(ctx,next)=>{
        let error_msg
        if(ctx.request.body.mobile === '' || ctx.request.body.password === '' ){
            error_msg='用户名和密码不能为空.'
        }

        if(error_msg){
            ctx.status =422
            return ctx.body={error:error_msg}
        }
        await next()
    }
}

router.post('/',checkCaptcha(),async(ctx,next)=>{
    await passport.authenticate('local', async (err, user, info)=> {
        if (err) ctx.throw(err)
        if(info){
          ctx.status = 403
          return ctx.body = info
        }

        console.log(user)

        const token = auth.signToken(user._id)
        ctx.body = {token: token}
      })(ctx, next)    
})


module.exports = router