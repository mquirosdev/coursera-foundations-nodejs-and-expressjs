const express = require('express');
const mongoose = require('mongoose');
const { ZodError } = require('zod');

const PORT = process.env.PORT || 3000;
const app = express();
const userRouter = require('./routers/userRouter.js');

mongoose
  .connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`)
  .then(function() { console.log("Successfully connected to mongodb"); })
  .catch(err => { console.log("Connection to mongo failed: ", err) })
  
app.listen(PORT, () => console.log("Listen on port: ", PORT))

app.use('/users', userRouter)

app.use((err, _req, res, next) => {
  if(err.constructor.name.toString() == "MulterError") {
    res.status(400).json({ status: "error", msg: err.message });
  } else {
    next(err)
  }
});

app.use((err, _req, res, next) => {
  if(err instanceof ZodError) {
    res.status(422).json({
      messages: err.issues.map(i => `${i.path.join('.')} ${i.message}`)
    });
  } else if(err instanceof mongoose.Error.DocumentNotFoundError) {
    res.status(404).json({ messages: ["Record not found"] });
  } else {
    const status = err.status || 500;
    res.status(status).json({ messages: [err.message] });
  }
});

