const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();
const {MONGODB_URL, PORT} = require('./config');

const app = express();

// logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip : () => process.env.NODE_ENV === 'test'
}));

// Body Parser
app.use(express.json());

// Catch-all 404
app.use(function(req, res, next){
  const err = new Error('Uh oh, not found!');
  err.status = 404;
  next(err);
});

//Catch-all Errors 
app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

// Connect to MongoDB
if (require.main === module) {
  mongoose.connect(MONGODB_URL)
    .then(instance => {
      const conn = instance.connections[0];
      console.log(`Connected to mongodb://${conn.host}:${conn.port}`);
    })
    .catch(err => {
      console.log(`Uh oh, an error! ${err.message}`);
      console.log(err);
    });
}

// Listen for connections
app.listen(PORT, function(){
  console.log(`Server started on ${this.address().port}`);
}).on('error', err =>{
  console.log('Uh oh, an error!');
  console.log(err);
});