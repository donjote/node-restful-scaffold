const password = require('koa-passport')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const compose = require('koa-compose')
const mongoose =require('mongoose')
const config = require('../../config')

/** 验证token */
function authToken(){
    return compose([
        async (ctx,next)=>{
            if(ctx.query && ctx.query.access_token){
                ctx.headers.authorization = 'Bearer ' + ctx.query.access_token
            }
            await next()
        },
        koaJwt({secret:'secrets',passthrough:true})
    ])
}

/** 验证用户是否登录 */
function isAuthenticated(){
    return compose([
        authToken(),
        async (ctx,next)=>{
            if(!ctx.state.user) ctx.throw('未经授权的错误',401)
            await next()
        },
        async (ctx,next)=>{
            let user = await mongoose.model('User').findById(ctx.state.user._id)
            if(!user) ctx.throw('未经授权的错误',401)
            ctx.req.user = user
            await next()
        }
    ])
}

/** 验证用户权限 */
function hasRole(roleRequired){
    if(!roleRequired) this.throw('需要设置角色')
    return compose([
        isAuthenticated(),
        async (ctx,next)=>{
            if (config.userRoles.indexOf(ctx.req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                await next()
              }else {
                ctx.throw(403)
              }
        }
    ])
}

/** 生成token */
function signToken(userid){
    return jwt.sign({user_id:userid},config.security.jwt.secrets,{expiresIn:config.security.jwt.expiresIn})
}

/** sns登录传递参数 */
function snsPassport(){
    return compose([
        authToken(),
        async (ctx,next) =>{
          ctx.session.passport = {
            redirectUrl: ctx.query.redirectUrl || '/'
          }
          if(ctx.state.user){ 
            ctx.session.passport.userId = ctx.state.user._id 
          }
          await next()
        }
      ])
   
}

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
exports.signToken = signToken
exports.snsPassport = snsPassport