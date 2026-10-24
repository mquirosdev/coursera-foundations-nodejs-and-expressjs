const crypto = require('node:crypto');
const mongoose = require('mongoose');
const { addMinutes } = require('date-fns');

const VerificationCodeLength = 6;
const VerificationCodeMinutesTTL = 5;
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
        this.expiresAt = addMinutes(new Date(), VerificationCodeMinutesTTL);
        this.uuid = crypto.randomUUID();
      }
    }
  }
);

module.exports = mongoose.model('userVerifications', UserVerificationSchema);