
var Sequelize = require('sequelize')
var dbConfig = require('../app.json')

console.log(dbConfig, dbConfig.host)

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // SQLite only
  // storage: 'path/to/database.sqlite',

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
})

function connect () {
  return sequelize
}

module.exports = {
  connect: connect,
  getDbName: function() {
    return dbConfig.database
  }
}
