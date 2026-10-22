const { z } = require('zod');

const User = require('../../models/User.js');
const UserPresenter = require('../../presenters/UserPresenter.js');

const ParamsSchema = z.object({
  name: z.object({
    first: z.string().trim().optional(),
    last: z.string().trim().optional(),
  }).optional(),
  email: z.email("invalid").refine(async (email) => {
    const existingUser = await User.findOne({ email: email }).exec();
    return !existingUser
  }, { message: "taken" }),
  password: z.string("required").trim().min(10, { error: "invalid" }),
}, "invalid_params")

const createHandler = async (req, res, next) => {
  let params = await ParamsSchema.parseAsync(req.body);
  params = Object.assign(params, { status: "new" });

  const user = new User(params);
  await user.save();

  res.status(200).json(new UserPresenter(user).values);
}

module.exports = createHandler