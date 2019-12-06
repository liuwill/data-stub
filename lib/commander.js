'use strict'

/**
 * 从命令行参数中读取用户的执行参数
 */

var yargs = require('yargs')
var commander = yargs
  .usage('node data stub.\nUsage: $0 -t <table> -o <output> -p <print> -f <functionName> -c <configPath>')
  .option('table', {
    describe: '要生成的数据表',
    alias: 't',
    default: '',
  })
  .option('print', {
    describe: '是否打印',
    alias: 'p',
    default: 'console',
  })
  .option('function', {
    describe: '执行的功能[generate, ls, table]',
    alias: 'f',
    default: 'table',
  })
  .option('config', {
    describe: '配置文件的位置',
    alias: 'c',
    default: 'app.json',
  })
  .option('output', {
    describe: '输出目录',
    alias: 'o',
    default: 'dist',
  })
  .option('language', {
    describe: '输出语言',
    alias: 'l',
    default: 'javascript',
    choices: ['javascript', 'typescript'],
  })
  .help('help')

exports.getCommandConfig = function () {
  var cmdConfig = {
    tableName: '',
    language: '',
    outputPath: '',
    configPath: '',
    printConfig: true,
  }

  var argv = commander.argv
  cmdConfig.configPath = argv.config
  cmdConfig.outputPath = argv.output
  cmdConfig.tableName = argv.table
  cmdConfig.function = argv.function
  cmdConfig.language = argv.language
  cmdConfig.printConfig = argv.print === 'console'

  return cmdConfig
}

exports.commander = commander
