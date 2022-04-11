
const app = require('./app/index')

const { APP_PORT } = require('./config/config.base')




app.listen(APP_PORT, () => {
    console.log(`服务地址：http://localhost:${APP_PORT}`)
})