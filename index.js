'use strict'
var appConfig = null

var tableModule = require('./lib/table')
var templateModule = require('./lib/template')

var dbConnector = require('./lib/connection')
var orm = null

function init(config) {
  appConfig = config
  orm = dbConnector.connect(appConfig)
}

function showTable(tableName) {
  return orm.raw(`show create table ${tableName}`).then(created => {
    const createSql = created[0][0]['Create Table']
    const createLines = createSql.split('\n').map(item => item.trim())
    const commentMap = createLines
      .filter(item => item.startsWith('`'))
      .reduce((result, current) => {
        const meta = current.match(/`([a-z\_]+)` .+ COMMENT '(.*)'/i)
        if (meta && meta.length === 3) {
          result[meta[1]] = meta[2]
        }
        return result
      }, {})
    let tableComment = ''
    const tableMatch = createLines.slice(-1)[0].match(/COMMENT='(.+)'/i)
    if (tableMatch && tableMatch.length) {
      tableComment = tableMatch[1]
    }

    return orm.raw('desc ' + tableName).then(queryTable => {
      var tableData = tableModule.buildTable(tableName, queryTable[0], tableComment, commentMap)

      var templateData = templateModule.buildTemplate(tableData, appConfig.prefix)

      var fileContent = templateModule.render(templateData, templateModule.RENDER_TYPES.model)
      var filename = templateData.fileName

      return {
        file: filename,
        comment: tableComment,
        table: tableName,
        data: templateData,
        content: fileContent,
      }
    })
  })
}

function list(cmdConfig) {
  var dbName = dbConnector.getDbName()
  return orm.raw('show tables').then(function (queryTables) {
    const dbTables = []
    for (var i in queryTables[0]) {
      var line = queryTables[0][i]
      var generateSyntax = 'node bin.js -t ' + line['Tables_in_' + dbName] + ' -p'
      dbTables.push({
        table: line['Tables_in_' + dbName],
        command: generateSyntax,
      })
    }
    return dbTables
  })
}

function generate(cmdConfig) {
  return list(cmdConfig).then(listData => {
    const tablePromises = []
    for (const tableMeta of listData) {
      tablePromises.push(showTable(tableMeta.table))
    }

    return Promise.all(tablePromises).then(generatedTables => {
      return {
        index: {
          content: templateModule.render({
            tableList: generatedTables,
          }, templateModule.RENDER_TYPES.index),
        },
        tables: generatedTables,
      }
    })
  })
}

module.exports = {
  showTable: showTable,
  generate: generate,
  list: list,
  init,
}
