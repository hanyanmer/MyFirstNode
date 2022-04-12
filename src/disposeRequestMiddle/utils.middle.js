
//每个中间件可能都会包含的校验


/**
 * 这个是koa-parameter进行的参数校验方法，通过传入校验的规则和返回错误类型进行不同错误的报错
 * @param {*} rules 
 * @param {*} errorType 
 */

const validator = (rules, errorInfo = 'error') => {
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules)
        } catch (err) {
            // return ctx.app.emit('error', errorType, ctx)
            console.log('err', err)
            return ctx.body = err || errorInfo
        }
        await next()
    }
}
module.exports = {
    validator,
}