'use strict'
var colors = require('colors/safe')
var dbConnector = require('./lib/connection')
var orm = dbConnector.connect()

var tableModule = require('./lib/table')
var templateModule = require('./lib/template')

function generate(cmdConfig, endCallback) {
  var tableName = cmdConfig.tableName
  orm.query('desc ' + tableName).then(function(queryTable) {
    var tableData = tableModule.buildTable(tableName, queryTable[0])

    var templateData = templateModule.buildTemplate(tableData)
    // var contentTypes = ['mapper', 'modal', 'xml']

    var fileContent = templateModule.render(templateData, templateModule.RENDER_TYPES.modal)
    console.log('create file: ' + tableName)
    console.log('============================\n')
    console.log(fileContent)
    endCallback(null)
  }).catch(function (err) {
    endCallback(err)
  })
}

function list(cmdConfig, endCallback) {
  var dbName = dbConnector.getDbName()
  orm.query('show tables').then(function(queryTables) {
    console.log('show tables: ')
    console.log('============================\n')

    for (var i in queryTables[0]) {
      var line = queryTables[0][i]
      var generateSyntax = 'node bin.js -t ' + line['Tables_in_' + dbName] + ' -p'
      console.log(colors.green(line['Tables_in_' + dbName]), '[ ' + colors.yellow(generateSyntax) + ' ]')
    }
    endCallback(null)
  }).catch(function (err) {
    endCallback(err)
  })
}

module.exports = {
  generate: generate,
  list: list,
}
