
const Koa = require('koa')
const KoaBody = require('koa-body')


const router = require('../router/index')

const app = new Koa()



app.use(KoaBody())
router.get('/', (ctx, next) => {
    ctx.body = 'helloworld'
})

app.use(router.routes())

module.exports = app