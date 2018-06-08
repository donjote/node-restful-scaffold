// 生产环境配置
// ==================================
module.exports = {
  //开发环境mongodb配置
  mongo: {
    uri: `mongodb://localhost/tate`
  },
  //开发环境redis配置
  redis: {
    db: 0
  },
  seedDB: true,
  security:{
    jwt:{
      expiresIn: 60000*60*24*365
    }
  }
}