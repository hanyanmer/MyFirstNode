# 我的nodejs项目模板



## 1 技术及文档

- nodejs： [assert 断言 | Node.js API 文档 (nodejs.cn)](http://nodejs.cn/api/assert.html)
- koa：[Koa (koajs) -- 基于 Node.js 平台的下一代 web 开发框架 | Koajs 中文文档 (bootcss.com)](https://koa.bootcss.com/)
- 数据库对象映射：[入门 | Sequelize 中文文档 | Sequelize 中文网](https://www.sequelize.com.cn/core-concepts/getting-started)
- 加密：[bcryptjs - npm (npmjs.com)](https://www.npmjs.com/package/bcryptjs)
- 颁发token：[jsonwebtoken - npm (npmjs.com)](https://www.npmjs.com/package/jsonwebtoken)









## 2 项目启动

### 2.1 项目本地设置

在my-node-template/.env配置文件中修改服务运行的端口

```js
#服务端口
APP_PORT = 8001
#mysql的主机
MYSQL_HOST = localhost
#mysql的端口
MYSQL_PORT = 3306
#mysql用户名
MYSQL_USER = root
#mysql用户密码
MYSQL_PWD = 123456
#mysql数据库
MYSQL_DB = test
```

 

### 2.2 安装依赖并运行

```shell
#进入到项目根路径，安装所需包
npm i 
#运行项目
npm run dev
#浏览器访问：http://localhost:8001
```



### 2.3 命令详解

```shell
npm run dev

npm run prod

```

## 3  IDE 

使用vscode，安装的插件列表

1. ESLint: 代码规范与错误提示(必须安装)

2. EditorConfig: 代码格式规范

3. Auto Close Tag: 输入开标签自动输入闭标签

4. Auto Rename Tag: 修改一侧标签时，自动修改另一侧标签

5. Bracket Pair Colorizer: 将括号设置为不同的颜色

6. GitLens -- Git supercharged: git工具，可以看到代码提交记录

7. Path Intellisense: 文件路径智能提示

8. Veter: 格式化vue文件



## 4  目录结构





## 5  项目创建过程中简述



### 5.1 自动重启服务

```shell
#安装
npm i nodemon -dev--save
#编写packeage.json脚本
"script":{
	"dev":"nodemon ./src/main.js"
}
#启动服务
npm run dev
```



### 5.2 读取配置文件

使用dotenv，读取根目录下的.env文件，将配置写道process.env中

```shell
#安装
npm i dotenv
#创建.env文件
APP_PORT= 8080 #设置服务端口
#创建src/config/config.base.js
const dotenv = require('dotenv')
dotenv.config()
module.exports = process.env
#main.js
const Koa = require('koa')
const {APP_PORT} = require('./config/config.base')
const app = new Koa()
app.listen(APP_PORT,()=>{
	console.log(`服务地址：http://localhost:${APP_PORT}`)
})
```



### 5.3  添加路由配置，自动添加到router对象

router/index.js文件会自动读取当前目录下的所有文件，然后进行挂载到router对象上

```js

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
```

只需要在/src/router中加入一个xxx.router.js配置文件并导出router就可以

### 5.4 http服务和app业务进行拆分

```js
#创建src/app/index.js
const Koa = require('koa')
const router = require('../router/index')
const app = new Koa()
app.use(router.routes())
module.exports = app

#main.js
const app = require('./app')
app.listen(APP_PORT,()=>{
	console.log(`服务地址：http://localhost:${APP_PORT}`)
})
```

### 5.5  使用koa-body解析post数据

```js
#安装
npm i koa-body
#注册中间件
const KoaBody = require('koa-body')
app.use(KoaBody()) #这里注意，在所有注册中间件之前调用这个
#使用ctx.request.body获取post的提交请求数据
ctx.request.body 
```



### 5.6 将请求拆分为controller、service层

controller层用来将路由对应的处理函数实现部分拆分出去。

service主要用来操作数据库相关的操作（通过model模型对象进行操作）

案例： 注册用户

user.router.js

```js
const Router = require('koa-router')
const { register } = require('../controller/user.contrller')

const router = new Router()
router.post('/register', register)
module.exports = router 
```

controller/user.controller.js

```js
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
```

service/user.service.js

```js
const User = require('../model/user.model')
class UserService {
    async createUser(user_name, password) {
        //通过User对象插入数据，
        const res = await User.create({ user_name, password })
        return res.dataValues
    }
}
module.exports = new UserService()
```

model模型对象（通过这个对象即可以创建表，可以操作增删改查等操作）





### 5.7 使用sequelize使用数据库

1. 安装sequelize 和数据库驱动mysql2

```shell
npm install sequelize 
npm install mysql2 
```

2. 创建seq对象进行连接数据库

```js

const {Sequelize} = require('sequelize')
const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PWD,
    MYSQL_DB
} = require('../config/config.base')
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    dialect: 'mysql'
})
#const seq = new Sequelize(数据库名称，用户名，用户密码，{
#	host: 主机，
#	dialect: 'mysql'
#})
#测试数据库是否可以连接
seq.authenticate()
    .then(() => {
        console.log('connected success!!!')
    }).catch((err) => {
        console.log('connected failed', err)
    })
module.exports = seq
```

3. 通过seq对象创建模型

```js
#例如，创建一个用户表
const { DataTypes } = require('sequelize')
const seq = require('../db/seq')

//通过define定义一个模型，定义模型后可以通过这个模型进行增删改查操作
const User = seq.define('test_user', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '用户名',
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码',
    },
})
//如果表不存在，则创建该表（如果已经存在，则不执行任何操作）
User.sync()
module.exports = User
```

4. 通过创建的模型对象User可以进行增删改查

   如5.6中service层对数据库的操作



### 

