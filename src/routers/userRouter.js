import express from "express";

import bodyParserMiddleware from '../middleware/bodyParserMiddleware.js';
import createHandler from '../controllers/users/createHandler.js';
import verifyHandler from "../controllers/users/verifyHandler.js";
import getVerificationHandler from '../controllers/users/getVerificationHandler.js'

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

export default userRouter;