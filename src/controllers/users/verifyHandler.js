const { z } = require('zod');

const UserVerification = require('../../models/UserVerification.js');
const User = require('../../models/User.js');

const ParamsSchema = z.object({
  uuid: z.string().trim().min(1),
  code: z.string().trim().min(1)
});

module.exports = async (req, res) => {
  const { uuid, code } = await ParamsSchema.parseAsync(req.body);

  const verification = await UserVerification.findOne({
    uuid,
    code,
    expiresAt: { "$gt": new Date() }
  }).orFail();

  verification.expiresAt = (new Date().valueOf() - 1000);
  await verification.save();

  const user =  await User.findOne({ email: verification.email, status: "new" }).orFail();
  user.status = "active";
  await user.save();

  res.status(200).send();
}