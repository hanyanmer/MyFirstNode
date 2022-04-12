|-- my-node-template
    |-- .env                        存放一些环境配置
    |-- .gitignore                  提交git时使用的文件
    |-- directoryList.md            生成的目录文件
    |-- package-lock.json
    |-- package.json
    |-- readme.md
    |-- src
        |-- main.js                 项目的入口文件
        |-- app
        |   |-- index.js            业务入口
        |-- config
        |   |-- config.base.js      读取配置
        |-- constant
        |   |-- errorStatus.js      常量
        |-- controller
        |   |-- user.contrller.js   处理请求
        |-- db
        |   |-- seq.js              连接数据库
        |-- disposeRequestMiddle    处理请求过程中的一些函数
        |   |-- user.middle.js
        |   |-- utils.middle.js
        |-- model
        |   |-- user.model.js       模式（对应数据库中表）
        |-- router                  路由配置（根据不同的url进行不同的函数处理）
        |   |-- hello.route.js
        |   |-- index.js            将新添加的路由文件自动注册到router对象上
        |   |-- uploadfile.route.js
        |   |-- user.route.js
        |-- service                 操作数据库，供controller层调用
        |   |-- user.service.js
        |-- upload                  上传文件后存放的目录
            |-- upload_134e4657e3ff4108e1aba69ad2e83c69.png
