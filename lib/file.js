const fs = require('fs')
const path = require('path')

function saveGeneratedTemplate(rootPath, tableContent) {
  if (!fs.existsSync(rootPath)) {
    throw new Error('root path is not exist')
  }
  fs.writeFileSync(path.join(rootPath, `${tableContent.file}.modal.js`), tableContent.content, 'utf-8')
}

module.exports = {
  saveGeneratedTemplate,
}
