'use strict'

/**
 * 处理数据库结构与生成代码的类型和结构映射
 */

var GENERATOR_RULE = {
  'VARCHAR': { 'targetType': 'String' },
  'TEXT': { 'targetType': 'String' },
  'TINYTEXT': { 'targetType': 'String' },
  'LONGTEXT': { 'targetType': 'String' },
  'INTEGER': { 'targetType': 'Number' },
  'INT': { 'targetType': 'Number' },
  'MEDIUMINT': { 'targetType': 'Number' },
  'TINYINT': { 'targetType': 'Number' },
  'TINY': { 'targetType': 'Number' },
  'FLOAT': { 'targetType': 'Number' },
  'REAL': { 'targetType': 'Number' },
  'DOUBLE': { 'targetType': 'Number' },
  'DECIMAL': { 'targetType': 'Number' },
  'DATETIME': { 'targetType': 'Date' },
  'DATE': { 'targetType': 'Date' },
  'TIMESTAMP': { 'targetType': 'Date' },
}

var LENGTH_TYPES = ['VARCHAR', 'DECIMAL']

var SIMPLE_FIELDS = ['add_time', 'add_user', 'updated_time', 'update_user']

var HIDDEN_FIELDS = ['id', 'add_time', 'add_user', 'updated_time', 'update_user', 'deleted']

exports.GENERATOR_RULE = GENERATOR_RULE

function Table(tableName, tableComment) {
  this.tableName = tableName
  this.comment = tableComment
  this.fields = []
  this.data = {}

  this.addCol = function (field, fieldData) {
    var config = Column.factory(field, fieldData)

    this.data[field] = config
    this.fields.push(field)

    // eslint-disable-next-line
    // TODO this place closure may course some problem
    Object.defineProperty(this, field, {
      get: function () {
        return this.data[field]
      },
      set: function (val) {
        this.data[field] = val
      }
    })
  }
}

Table.factory = function (tableName, tableDatas, tableComment, commentMap) {
  var dbTable = new Table(tableName, tableComment)

  for (var i in tableDatas) {
    var tableData = tableDatas[i]
    var type = tableData['Type']
    var field = tableData['Field']
    var nullMark = tableData['Null'] === 'YES'
    var defaultValue = tableData['Default'] || ''

    dbTable.addCol(field, {
      type: type,
      nullMark: nullMark,
      defaultValue: defaultValue,
      comment: commentMap[field]
    })
  }
  return dbTable
}

function Column(data) {
  this.rawType = data.rawType
  this.targetType = data.targetType
  this.field = data.field
  this.comment = data.comment
  this.typeLength = data.typeLength
  this.nullMark = data.nullMark
  this.defaultValue = data.defaultValue
  this.simpleMark = data.simpleMark
  this.hiddenMark = data.hiddenMark
}

Column.factory = function (field, fieldData) {
  var type = fieldData.type

  var bracePos = type.indexOf('(')
  var rawType = type.toUpperCase()
  var targetType = ''
  var typeLength = ''

  if (bracePos < 0) {
    targetType = GENERATOR_RULE[rawType]['targetType']
  } else {
    var qType = rawType.substr(0, bracePos)

    targetType = GENERATOR_RULE[qType]['targetType']
    if (LENGTH_TYPES.indexOf(qType) >= 0) {
      typeLength = rawType.substr(bracePos)
    }
  }

  var simpleMark = false
  if (SIMPLE_FIELDS.indexOf(field) >= 0) {
    simpleMark = true
  } else if (fieldData.nullMark && !fieldData.defaultValue) {
    simpleMark = true
  }

  var hiddenMark = false
  if (HIDDEN_FIELDS.indexOf(field) >= 0) {
    hiddenMark = true
  }

  return new Column({
    field: field,
    rawType: rawType,
    targetType: targetType,
    typeLength: typeLength,
    nullMark: fieldData.nullMark,
    defaultValue: fieldData.defaultValue,
    simpleMark: simpleMark,
    hiddenMark: hiddenMark,
    comment: fieldData.comment
  })
}

exports.Table = Table
exports.Column = Column
exports.buildTable = Table.factory
