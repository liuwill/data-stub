'use strict'

/**
 * 从命令行参数中读取用户的执行参数
 */

var yargs = require('yargs')
var commander = yargs
  .usage('node mybatis generator.\nUsage: $0 -t <table> -o <output> -p <print>')
  .option('table', {
    describe: '要生成的数据表',
    alias: 't',
    default: ''
  })
  .option('print', {
    describe: '是否打印',
    alias: 'p',
    default: 'console'
  })
  .option('function', {
    describe: '执行的功能',
    alias: 'f',
    default: 'table',
  })
  .option('output', {
    describe: '输出目录',
    alias: 'o',
    default: 'target'
  })
  .help('help')

exports.getCommandConfig = function () {
  var cmdConfig = {
    tableName: '',
    outputPath: '',
    printConfig: true
  }

  var argv = commander.argv
  cmdConfig.outputPath = argv.output
  cmdConfig.tableName = argv.table
  cmdConfig.function = argv.function
  cmdConfig.printConfig = argv.print === 'console'

  return cmdConfig
}

exports.commander = commander
