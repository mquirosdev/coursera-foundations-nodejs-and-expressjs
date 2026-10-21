const { z } = require('zod');

const User = require('../../models/User.js');
const { UserStatuses } = require('../../constants.js')

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

class UserPresenter {
  constructor(object) {
    this.object = object;
  }

  get values() {
    return {
      _id: this.object._id,
      name: this.object.name,
      email: this.object.email,
      status: this.object.status
    }
  }
}

const createHandler = async (req, res, next) => {
  let params = await ParamsSchema.parseAsync(req.body);
  params = Object.assign(params, { status: "new" });
  const user = new User(params);
  user
    .save()
    .then((record) => {
      const userResponse = new UserPresenter(record).values
      res.status(200).json(userResponse);
    })
    .catch(error => {
      next(error)
    })
}

module.exports = createHandler