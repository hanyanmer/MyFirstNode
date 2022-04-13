const bcrypt = require('bcryptjs')


const bcryptPasswrod = async (ctx, next) => {
    const { password } = ctx.request.body
    //从官方直接copy过来就可以，hash保存的是密文
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    ctx.request.body.password = hash
    await next()
}
module.exports = {
    bcryptPasswrod,
}