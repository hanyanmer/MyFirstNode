const Router = require('koa-router')
const { register } = require('../controller/user.contrller')

const router = new Router()
router.post('/register', register)
module.exports = router 