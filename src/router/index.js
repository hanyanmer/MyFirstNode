const fs = require('fs')
const Router = require('koa-router')
const router = new Router()

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js') {
        // 导入当前目录下的所有路由文件，注册到router对象中
        let r = require('./' + file) //每个文件导入后都会得到一个router对象
        router.use(r.routes()) //router也可以注册中间件的
    }
})

module.exports = router