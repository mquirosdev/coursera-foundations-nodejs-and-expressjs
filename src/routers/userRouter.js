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

userRouter.put("/verification/confirm",
  bodyParserMiddleware.none(),
  verifyHandler
)

userRouter.post("/verification",
  bodyParserMiddleware.none(),
  getVerificationHandler
)

module.exports = userRouter;