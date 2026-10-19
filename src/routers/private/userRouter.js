const express = require('express');
const userRouter = express.Router()
module.exports = userRouter;

const bodyParserMiddleware = require('../../middleware/bodyParserMiddleware.js');

const UserModel = require("../../models/User.js");
userRouter.post("/", 
  bodyParserMiddleware.none(),
  (req, res) => {
    const user = new UserModel(req.body);
    user
      .save()
      .then(function() {
        res.status(200).json({ status: "ok", msg: "action succeeded" });
      })
      .catch(error => {
        res.status(422).json(Object.values(error.errors).map(e => e.message))
      })
  }
)

// userRouter.get("/:userId", 
//   bodyParserMiddleware.fields([
//     { name: 'avatar', maxCount: 1 },
//     { name: 'avatarTwo', maxCount: 1 }
//   ]),
//   (req, res) => {
//     console.log(req.files);
//     console.log(req.body);
//     res.send("User by Id");
//   }
// )