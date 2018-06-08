const mongoose = require('mongoose')
const crypto = require('crypto')

let UserSchema = new mongoose.Schema({
    nickname:{
        unique:true,
        type:String
    },
    mobile:{
        unique:true,
        type:String
    },
    weibo:{
        id:String,
        email:String,
        name:String
    },
    qq:{
        id:String,
        email:String,
        name:String
    },
    weixin:{
        id:String,
        email:String,
        name:String
    },
    hashedPassword: String,
	salt: String,
	role: {
		type : String ,
		default : 'user'
	},
    avatar:String,
    locked:{
        type:Boolean,
        default:false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})

UserSchema
    .virtual('password')
    .set(function(password){
        this._password = password
        this.salt = this.makeSalt()
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })

UserSchema.methods={
    //检查用户权限
    hasRole:function(role){
        let selfRoles = this.role
        return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1)
    },
    //验证用户密码
	authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword
      },
      //生成盐
      makeSalt: function() {
        return crypto.randomBytes(16).toString('base64')
      },
      //生成密码
      encryptPassword: function(password) {
        if (!password || !this.salt) return ''
        var salt = new Buffer(this.salt, 'base64')
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
      }
}

exports.UserSchema = UserSchema
module.exports = mongoose.model('User', UserSchema)