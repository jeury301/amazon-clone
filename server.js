// loading third-party packages
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// loading application-related packages
var User = require('./models/user');

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

// middleware
app.use(morgan('dev')) // logging changes on server
app.use(bodyParser.json()) // application can now parse json data
app.use(bodyParser.urlencoded({extended: true})) // application can now parse urlencoded data

// post to create user
app.post('/create-user', function(req, res){
  var user = new User();
  user.profile.name = req.body.profile.name;
})

// // application entry point
app.get('/', function(req, res){
  res.json("Amazon-clone home");
});

// listening on port 3000
app.listen(3000, function(err){
  if(err) throw err;
  console.log("Server is runnning on port 3000");
});
