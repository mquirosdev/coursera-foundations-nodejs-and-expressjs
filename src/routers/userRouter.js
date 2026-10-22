const express = require('express');

const bodyParserMiddleware = require('../middleware/bodyParserMiddleware.js');
const createHandler = require('../controllers/users/createHandler.js');
const verifyHandler = require('../controllers/users/verifyHandler.js');
const getVerificationHandler = require('../controllers/users/getVerificationHandler.js');

const userRouter = express.Router();

userRouter.post("/", 
  bodyParserMiddleware.none(),
  createHandler
)

userRouter.put("/verify",
  bodyParserMiddleware.none(),
  verifyHandler
)

userRouter.post("/getVerification",
  bodyParserMiddleware.none(),
  getVerificationHandler
)

module.exports = userRouter;