'use strict'
var colors = require('colors/safe')
var path = require('path')
var dbConfig = require(path.resolve('./app.json'))

var dbConnector = require('./lib/connection')
var orm = dbConnector.connect()

var tableModule = require('./lib/table')
var templateModule = require('./lib/template')

function generate(cmdConfig) {
  var tableName = cmdConfig.tableName

  return orm.raw(`show create table ${tableName}`).then(created => {
    const commentMap = created[0][0]['Create Table']
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.startsWith('`'))
      .reduce((result, current) => {
        const meta = current.match(/`([a-z\_]+)` .+ COMMENT '(.*)'/i)
        if (meta && meta.length === 3) {
          result[meta[1]] = meta[2]
        }
        return result
      }, {})

    // console.log(commentMap)
    return orm.raw('desc ' + tableName).then(queryTable => {
      var tableData = tableModule.buildTable(tableName, queryTable[0], commentMap)

      var templateData = templateModule.buildTemplate(tableData, dbConfig.prefix)
      // var contentTypes = ['mapper', 'modal', 'xml']

      var fileContent = templateModule.render(templateData, templateModule.RENDER_TYPES.modal)
      var filename = templateData.fileName
      console.log(`create file: ${tableName}[${filename}]`)
      console.log('============================\n')
      // console.log(fileContent)

      return {
        file: filename,
        content: fileContent,
      }
    })
  })
}

function list(cmdConfig, endCallback) {
  var dbName = dbConnector.getDbName()
  orm.raw('show tables').then(function (queryTables) {
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
