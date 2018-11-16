
const Knex = require('knex')
var path = require('path')
var dbConfig = require(path.resolve('./app.json'))

const knex = new Knex({
  client: 'mysql',
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    charset: dbConfig.charset,
  }
})

function connect () {
  return knex
}

module.exports = {
  connect: connect,
  getDbName: function() {
    return dbConfig.database
  }
}
