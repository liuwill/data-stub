
const Knex = require('knex')
var dbConfig = null

let knex = null

function connect(config) {
  dbConfig = config.mysql

  if (!knex) {
    knex = new Knex({
      client: 'mysql',
      connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        charset: dbConfig.charset,
      },
    })
  }
  return knex
}

module.exports = {
  connect: connect,
  getDbName: function () {
    return dbConfig.database
  },
}
