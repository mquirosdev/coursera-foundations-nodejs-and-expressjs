const express = require('express');

const bodyParserMiddleware = require('../middleware/bodyParserMiddleware.js');
const createHandler = require('../controllers/users/createHandler.js');

const userRouter = express.Router();

userRouter.post("/", 
  bodyParserMiddleware.none(),
  createHandler
)

module.exports = userRouter;

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