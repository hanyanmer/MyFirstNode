const { Sequelize } = require('sequelize')

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
seq.authenticate()
    .then(() => {
        console.log('connected success!!!')
    }).catch((err) => {
        console.log('connected failed', err)
    })


module.exports = seq