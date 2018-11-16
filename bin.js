#!/usr/bin/env node
var commander = require('./lib/commander')
var dbTools = require('./')

try {
  var cmdConfig = commander.getCommandConfig()
  if (cmdConfig.function === 'table') {
    dbTools.generate(cmdConfig, function (err) {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        process.exit(0)
      }
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
