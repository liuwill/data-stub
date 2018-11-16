'use strict'

/**
 * 对应模版的数据类型
 */

var path = require('path')
var fs = require('fs')
// var nunjucks = require('nunjucks')
var ejs = require('ejs')
var simpleCamelcase = require('simple-camelcase')

var COLUMN_FIELDS = [
  'typeLength', 'nullMark', 'defaultValue',
  'nullMark', 'defaultValue', 'simpleMark',
  'hiddenMark', 'comment',
]

var RENDER_TYPES = {
  'modal': 'modal',
  'index': 'index',
}

function Template(tableName) {
  this.tableName = tableName
  this.baseParamName = ''
  this.baseClassName = ''
  this.modalName = ''

  this.packages = []
  this.columns = []
}

function TemplateItem(fieldName) {
  this.field = fieldName

  this.targetType = ''
  this.lowerCamelField = ''
  this.upperCamelField = ''
}

function buildTemplate(table, prefix) {
  var template = new Template(table.tableName)
  var baseClassName = simpleCamelcase.toUpperCamel(template.tableName)
  var baseParamName = simpleCamelcase.toLowerCamel(table.tableName)

  template.baseClassName = baseClassName
  template.fileName = simpleCamelcase.toLowerCamel(template.tableName)
  const tbPrefix = `${prefix}_`
  if (template.tableName.startsWith(tbPrefix)) {
    template.fileName = simpleCamelcase.toLowerCamel(template.tableName.replace(tbPrefix, ''))
  }
  template.baseParamName = baseParamName

  template.modalName = baseClassName + 'PO.java'

  for (var i in table.fields) {
    var fieldName = table.fields[i]
    var fieldData = table[fieldName]
    if (fieldData.hiddenMark){
      continue
    }

    var targetType = fieldData.targetType

    var templateItem = new TemplateItem(fieldName)
    templateItem.targetType = targetType

    for(var k in COLUMN_FIELDS) {
      var key = COLUMN_FIELDS[k]
      templateItem[key] = fieldData[key]
    }

    templateItem.lowerCamelField = simpleCamelcase.toLowerCamel(fieldName)
    templateItem.upperCamelField = simpleCamelcase.toUpperCamel(fieldName)
    template.columns.push(templateItem)
  }
  return template
}

function render(template, type) {
  const templateContent = fs.readFileSync(path.join(__dirname, `./templates/${type}.ejs`), 'utf-8')
  return ejs.render(templateContent, template)
  // var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, './templates'), {
  //   trimBlocks: true,
  //   lstripBlocks: true
  // }))
  // return nunjucksEnv.render(type + '.njk', template)
}

module.exports = {
  Template: Template,
  TemplateItem: TemplateItem,
  buildTemplate: buildTemplate,
  RENDER_TYPES: RENDER_TYPES,
  render: render
}
