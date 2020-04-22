const fs = require('fs')
const path = require('path')

function saveGeneratedTemplate(rootPath, tableContent, options) {
  if (!fs.existsSync(rootPath)) {
    throw new Error('root path is not exist')
  }
  const extend = options['extend']
  fs.writeFileSync(path.join(rootPath, `${tableContent.file}.model.${extend}`), tableContent.content, 'utf-8')
}

function saveModalIndex(rootPath, content, options) {
  if (!fs.existsSync(rootPath)) {
    throw new Error('root path is not exist')
  }
  const extend = options['extend']
  fs.writeFileSync(path.join(rootPath, `index.${extend}`), content, 'utf-8')
}

function saveModalDefine(rootPath, content, options) {
  if (!fs.existsSync(rootPath)) {
    throw new Error('root path is not exist')
  }
  const extend = options['extend']
  fs.writeFileSync(path.join(rootPath, `define.${extend}`), content, 'utf-8')
}

module.exports = {
  saveGeneratedTemplate,
  saveModalIndex,
  saveModalDefine,
}
