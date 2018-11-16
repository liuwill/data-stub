var BaseModal = require('../modal')

var modal = {
  table: '',
  fields: {
    '': {
      type: String,
      name: '',
      comment: '',
    }
  }
}
module.exports = new BaseModal(modal)
