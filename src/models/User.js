const mongoose = require('mongoose');
const digestPasswordString = require('../services/digestPasswordString.js');

const schema = new mongoose.Schema(
  {
    name: {
      first: { type: String, trim: true },
      last: { type: String, trim: true },
    },
    email: { 
      type: String,
      required: true,
      index: true,
      unique: true
    },
    passwordDigest: { 
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    }
  }
)

schema
  .virtual('password')
  .set(function(v) {
    const [passwordDigest, salt] = digestPasswordString(v);
    this.passwordDigest = passwordDigest;
    this.salt = salt;
  });

module.exports = mongoose.model('users', schema);