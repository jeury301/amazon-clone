// loading packages
var express = require('express');
var morgan = require('morgan');

// creating express application
var app = express();

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
