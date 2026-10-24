import crypto from "node:crypto";
import { addMinutes } from "date-fns";
import { Schema, model } from "mongoose";

const VerificationCodeLength = 6;
const VerificationCodeMinutesTTL = 5;
const UserVerificationSchema = Schema(
  {
    uuid: {
      type: Schema.Types.UUID,
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

export default model('userVerifications', UserVerificationSchema);