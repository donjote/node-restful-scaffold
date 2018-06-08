const Router = require("koa-router")
const router = new Router()

router.use('/auth',require('../apis/auth').routes())


module.exports = router