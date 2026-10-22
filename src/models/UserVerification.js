const mongoose = require('mongoose');
const crypto = require('node:crypto');

const VerificationCodeLength = 6;
const VerificationCodeTTL = 5 * 60 * 1000; // Five minutes in miliseconds
const UserVerificationSchema = mongoose.Schema(
  {
    uuid: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      index: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    code: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    methods: {
      generateCode: function() {
        let code = [];
        for(let i = 1; i <= VerificationCodeLength; i++) { code.push(Math.floor(Math.random() * 10)); }
        this.code = code.join('');
        this.expiresAt = (new Date().valueOf() + VerificationCodeTTL);
        this.uuid = crypto.randomUUID();
      }
    }
  }
);

module.exports = mongoose.model('userVerifications', UserVerificationSchema);