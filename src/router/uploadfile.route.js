const Router = require('koa-router')

const router = new Router()
router.post('/upload', (ctx, next) => {
    console.log(ctx.request.files.file.path)
    ctx.body = ctx.request
})

module.exports = router