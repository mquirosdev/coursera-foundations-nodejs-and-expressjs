const crypto = require('node:crypto');

function digestPasswordString(str, salt) {
  if(!salt) salt = crypto.randomBytes(16).toString('hex');

  return [
    crypto.scryptSync(str, salt, 64).toString('hex'),
    salt
  ]
}

module.exports = digestPasswordString;