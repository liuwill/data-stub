'use strict'

var chai = require('chai')

chai.should()
var expect = chai.expect
var assert = chai.assert

var sampleTable = require('../sample/sample_table')

var tableModule = require('../../lib/table')
var templateModule = require('../../lib/template')
var config = require('../../lib/config')
var Table = tableModule.Table

describe('#template module', function () {
  var tableName = 'sample'
  var targetTable = Table.factory(tableName, sampleTable.TABLE_ROWS, [], {})
  var tplObj = templateModule.buildTemplate(targetTable)

  it('hidden some column because of frame', function () {
    var hiddenTable = Table.factory(`pre_${tableName}`, sampleTable.TABLE_ROWS, [], {})
    hiddenTable.data['id'].hiddenMark = true
    var hiddenObj = templateModule.buildTemplate(hiddenTable, `pre`)

    expect(hiddenObj.columns).to.have.lengthOf(targetTable.fields.length - 2)
    assert.isTrue(hiddenObj.tableName.startsWith('pre'))
    assert.isFalse(hiddenObj.fileName.startsWith('pre'))
  })

  describe('#build Template class', function () {
    it('Template came from table', function () {
      expect(tableName).to.be.equal(tplObj.tableName)
      expect(tplObj.columns).to.have.lengthOf(targetTable.fields.length - 2)
    })
  })

  describe('#render templates', function () {
    it('will render proper template', function () {
      var modalContent = templateModule.render(tplObj, templateModule.RENDER_TYPES.model)
      expect(modalContent).to.have.string(`table: '${ tplObj.tableName }',`)

      for (var i in tplObj.columns) {
        var item = tplObj.columns[i]
        expect(modalContent).to.have.string(`'${item.field}': {`)
      }
    })

    it('will render typescript template', function () {
      var modalContent = templateModule.render(
        tplObj,
        templateModule.RENDER_TYPES.model,
        config.support.TYPESCRIPT
      )
      expect(modalContent).to.have.string(`table: '${ tplObj.tableName }',`)

      for (var i in tplObj.columns) {
        var item = tplObj.columns[i]
        expect(modalContent).to.have.string(`'${item.field}': {`)
      }
    })
  })
})
