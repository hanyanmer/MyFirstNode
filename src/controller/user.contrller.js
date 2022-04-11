
const { createUser } = require('../service/user.service')

class UserController {
    async register(ctx, next) {
        //获取请求数据体
        const { user_name, password } = ctx.request.body
        //调用service操作数据库
        try {
            let res = await createUser(user_name, password)
            //返回结果
            ctx.body = {
                code: 200,
                message: 'register success',
                result: {
                    id: res.id,
                    user_name: res.user_name
                }
            }
        } catch (err) {
            console.err(err)
        }

    }
}
module.exports = new UserController