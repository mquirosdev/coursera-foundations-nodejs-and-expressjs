const crypto = require('node:crypto');

function digestPasswordString(str, salt="change-this-later") {
  return crypto.scryptSync(str, salt, 64).toString('hex')
}

module.exports = digestPasswordString;