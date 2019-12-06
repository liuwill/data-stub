'use strict'

/**
 * 对应模版的数据类型
 */

const path = require('path')
const fs = require('fs')
// var nunjucks = require('nunjucks')
const ejs = require('ejs')
const config = require('./config')
const simpleCamelcase = require('simple-camelcase')

let COLUMN_FIELDS = [
  'typeLength', 'nullMark', 'defaultValue',
  'nullMark', 'defaultValue', 'simpleMark',
  'hiddenMark', 'comment',
]

let RENDER_TYPES = {
  'model': 'model',
  'index': 'index',
}

function Template(tableName) {
  this.tableName = tableName
  this.baseParamName = ''
  this.baseClassName = ''
  // this.modelName = ''

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
  let template = new Template(table.tableName)
  let baseClassName = simpleCamelcase.toUpperCamel(template.tableName)
  let baseParamName = simpleCamelcase.toLowerCamel(table.tableName)

  template.tableComment = table.comment
  template.baseClassName = baseClassName
  template.fileName = simpleCamelcase.toLowerCamel(template.tableName)
  const tbPrefix = `${prefix}_`
  if (template.tableName.startsWith(tbPrefix)) {
    template.fileName = simpleCamelcase.toLowerCamel(template.tableName.replace(tbPrefix, ''))
  }
  template.baseParamName = baseParamName

  // template.modelName = baseClassName + 'PO.java'

  for (let i in table.fields) {
    let fieldName = table.fields[i]
    let fieldData = table[fieldName]
    if (fieldData.hiddenMark) {
      continue
    }

    let targetType = fieldData.targetType

    let templateItem = new TemplateItem(fieldName)
    templateItem.targetType = targetType

    for (let k in COLUMN_FIELDS) {
      let key = COLUMN_FIELDS[k]
      templateItem[key] = fieldData[key]
    }

    templateItem.lowerCamelField = simpleCamelcase.toLowerCamel(fieldName)
    templateItem.upperCamelField = simpleCamelcase.toUpperCamel(fieldName)
    template.columns.push(templateItem)
  }
  return template
}

function render(template, type, lang) {
  const language = config['language'][lang]
  const fileMeta = [type]
  if (language && language['type']) {
    fileMeta.push(language['type'])
  }
  fileMeta.push('ejs')
  const fileName = fileMeta.join('.')
  const templateContent = fs.readFileSync(path.join(__dirname, `./templates/${fileName}`), 'utf-8')
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
  render: render,
}
