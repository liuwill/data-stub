#!/usr/bin/env node
var commander = require('./lib/commander')
var dbTools = require('./')
var fs = require('fs')
var path = require('path')
var colors = require('colors/safe')

if (!fs.existsSync(path.resolve('./app.json'))) {
  console.log(colors.red('Error! app.json Config is Missing!'))
  process.exit(1)
}

try {
  var cmdConfig = commander.getCommandConfig()
  if (cmdConfig.function === 'table') {
    dbTools.generate(cmdConfig).then(function(fileContent) {
      console.log(`> create file: ${colors.green(fileContent.table)} [${colors.gray(fileContent.file)}]`)
      console.log('============================\n')
      console.log(fileContent.content)
      process.exit(0)
    }).catch(function(err) {
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
