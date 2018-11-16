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
      console.log(fileContent)
      process.exit(0)
    }).catch(function(err) {
      console.error(err)
      process.exit(1)
    })
  } else if (cmdConfig.function === 'ls') {
    dbTools.list(cmdConfig, function (err) {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        process.exit(0)
      }
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
