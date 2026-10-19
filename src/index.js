const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const app = express();
const userRouter = require('./routers/private/userRouter');

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
  const status = err.status || 500;
  res.status(status).json({ status: "error", msg: err.message });
});

