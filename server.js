// loading packages
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

// creating express application
var app = express();

const options = {
  useNewUrlParser: true
}

// connecting to mongolab DB
mongoose.connect('mongodb://amazon-clone:amazon-clone123@ds127851.mlab.com:27851/amazon-clone-db',options,function(err){
  if(err){
    console.log("Connection error: "+err);
  } else{
    console.log("Connected to the database");
  }
})

// middleware - logging changes on server
app.use(morgan('dev'))

// application entry point
app.get('/', function(req, res){
  var name = "Jeury";
  res.json("My name is "+name);
});

// listening on port 3000
app.listen(3000, function(err){
  if(err) throw err;
  console.log("Server is runnning on port 3000");
});
