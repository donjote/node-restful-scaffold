const passport = require('koa-passport')
const Router = require("koa-router")
const router = new Router()

require('./local/passport').setup()
require('./qq/passport').setup()
require('./weibo/passport').setup()
require('./weixin/passport').setup()

router.use('/local',require('./local').routes())
router.use('/qq',require('./qq').routes())
router.use("/weibo",require('./weibo').routes())
router.use("/weixin",require('./weibo').routes())


module.exports = router