const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = async()=>{
    let userCount = await User.count()
    if(userCount == 0){
        await User.create({
            nickname:'admin',
            mobile:'13112345678',
            role:'admin',
            password:'admin'
        })
    }
}