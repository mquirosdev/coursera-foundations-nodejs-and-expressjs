const mongoose = require('mongoose');
const digestPasswordString = require('../services/digestPasswordString.js');
const stringIsValidEmail = require('../services/stringIsValidEmail.js');

const PasswordMinRequiredLength = 10;

const schema = new mongoose.Schema(
  {
    name: {
      first: { type: String, trim: true },
      last: { type: String, trim: true },
    },
    email: { 
      type: String,
      required: [true, "Email is required"],
      index: true,
      unique: true,
      validate: {
        validator: (v) => stringIsValidEmail(v),
        message: "Email is not valid"
      }
    },
    passwordDigest: { 
      type: String, 
      required: [true, "Password is required"]
    }
  }
)

schema
  .virtual('password')
  .set(function(v) {
    console.log("Virtual password setter");
    this._password = (typeof v == 'string') ? v.trim() : '';
    this.passwordDigest = digestPasswordString(v);
  });

schema.pre('validate', function() {
  const password = this._password || '';
  if(password.length < PasswordMinRequiredLength) {
    this.invalidate(
      'password',
      `Password should be at least ${PasswordMinRequiredLength} characters long`
    )
  }
});

const User = mongoose.model('users', schema);

module.exports = User;