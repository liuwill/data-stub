#!/usr/bin/env node
var commander = require('./lib/commander')
var fileUtils = require('./lib/file')
var dbTools = require('./')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var colors = require('colors/safe')

try {
  var cmdConfig = commander.getCommandConfig()

  var configPath = path.resolve(cmdConfig.configPath)
  if (!fs.existsSync(configPath)) {
    console.log(colors.red('Error! app.json Config is Missing!'))
    process.exit(1)
  }

  const dbConfig = require(configPath)
  dbTools.init(dbConfig)

  if (cmdConfig.function === 'generate') {
    const startTime = Date.now()
    dbTools.generate(cmdConfig).then(generatedData => {
      const outputPath = cmdConfig.outputPath
      const rootPath = path.resolve(outputPath)
      let basePromise = Promise.resolve(rootPath)
      if (!fs.existsSync(rootPath)) {
        basePromise = new Promise((resolve, reject) => {
          mkdirp(rootPath, function (err) {
            if (err) { reject(err) }
            else { resolve(rootPath) }
          })
        })
      }

      const generatedTables = generatedData.tables
      return basePromise.then(createdDir => {
        const rootStats = fs.statSync(rootPath)
        if (!rootStats.isDirectory()) {
          return Promise.reject(new Error('目录不存在'))
        }

        for (let singleTable of generatedTables) {
          const printLog = [
            'Start Save: ',
            colors.green(singleTable.table),
            'to',
            outputPath + '/' + colors.cyan(singleTable.file) + '.model.js',
            colors.gray(`[${Date.now() - startTime}ms]`)
          ]
          console.log(printLog.join(' '))
          fileUtils.saveGeneratedTemplate(rootPath, singleTable)
        }
        fileUtils.saveModalIndex(rootPath, generatedData.index.content)
        console.log('Create Index', colors.cyan(`${outputPath}/index.js`), colors.gray(`[${Date.now() - startTime}ms]`))
      })
    }).then(result => {
      const finishTime = Date.now()
      console.log(colors.yellow('> Generate Finish AT'), colors.gray(`[${finishTime - startTime}ms]`))
      process.exit(0)
    }).catch(function (err) {
      console.error(err)
      process.exit(1)
    })
  } else if (cmdConfig.function === 'table') {
    var tableName = cmdConfig.tableName
    dbTools.showTable(tableName).then(function (fileContent) {
      console.log(`> create file: ${colors.green(fileContent.table)} [${colors.gray(fileContent.file)}]`)
      console.log('============================\n')
      console.log(fileContent.content)
      process.exit(0)
    }).catch(function (err) {
      console.error(err)
      process.exit(1)
    })
  } else if (cmdConfig.function === 'ls') {
    dbTools.list(cmdConfig).then(listData => {
      console.log('> show tables: ')
      console.log('> ============================\n')

      for (let tableData of listData) {
        console.log('  ', colors.green(tableData.table), '[ ' + colors.yellow(tableData.command) + ' ]')
      }
      console.log('')
      process.exit(0)
    }).catch(err => {
      console.error(err)
      process.exit(1)
    })
  } else {
    console.log('命令不存在')
  }
} catch (err) {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    process.exit(0)
  }
}
