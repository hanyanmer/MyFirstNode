const Router = require('koa-router')
const { register } = require('../controller/user.contrller')
const { validator } = require('../disposeRequestMiddle/utils.middle')
const { bcryptPasswrod } = require('../disposeRequestMiddle/user.middle')

const router = new Router()
// 为了使代码逻辑更加清晰，这里可以拆分一个中间件层，封装多个中间件函数
// 这些函数如： 参数校验（参数是否合法），是否是登录状态等等
router.post('/register', validator({ user_name: 'string', password: 'string' }, '')
    , bcryptPasswrod
    , register
)

//登录接口需要验证当前登录的用户和密码是否正确这个函数verityLogin
//登录之后要进行登录状态的记录，通过token进行登录状态的记录
router.post('/login', (ctx, next) => {

})
module.exports = router 