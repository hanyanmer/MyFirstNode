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
