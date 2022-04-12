
const Koa = require('koa')
const KoaBody = require('koa-body')
const path = require('path')
const KoaStatic = require('koa-static')
const parameter = require('koa-parameter')


const router = require('../router/index')

const app = new Koa()


app.use(KoaBody({
    multipart: true,
    formidable: {
        keepExtensions: true,
        uploadDir: path.join(__dirname, '../upload')
    },
    // 以下的请求的请求体会放到ctx.request.body 上，默认只有前三个请求方式会，这里添加一个delete的请求
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}))
// 注册静态资源中间件,静态资源下的文件都可以通过url直接获取到资源
// 这里指定src/upload为静态资源目录
//http://localhost:8080/upload_134e4657e3ff4108e1aba69ad2e83c69.png 可以直接获取到图片
app.use(KoaStatic(path.join(__dirname, '../upload')))
app.use(parameter(app))


app.use(router.routes())

//统一接收错误处理
app.on('error', (err, ctx) => {
    ctx.body = err
})
module.exports = app