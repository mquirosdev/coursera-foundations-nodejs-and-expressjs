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
      default: "initial",
      required: [true, "Password is required"]
    },
    salt: {
      type: String,
      default: "initial",
      required: [true, "Salt is required"]
    }
  }
)

schema
  .virtual('password')
  .set(function(v) {
    this._password = (typeof v == 'string') ? v.trim() : '';
    const [passwordDigest, salt] = digestPasswordString(v);
    this.passwordDigest = passwordDigest;
    this.salt = salt;
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