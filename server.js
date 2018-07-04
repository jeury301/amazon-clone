// loading third-party packages
var express = require('express'); // web framework for node.js
var morgan = require('morgan'); // console logging for http requests
var mongoose = require('mongoose'); // mongodb ORM
var bodyParser = require('body-parser'); // http request parser
var ejs = require('ejs'); // templating engine
var ejs_mate = require('ejs-mate'); // ejs extension for flashy stuff ¯\_(ツ)_/¯

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
app.use(morgan('dev')); // logging changes on server
app.use(bodyParser.json()); // application can now parse json data
app.use(bodyParser.urlencoded({extended: true})) // application can now parse urlencoded data
app.engine('ejs', ejs_mate); // setting the type of engine to ejs
app.set('view engine', 'ejs'); // setting ejs

// post to create user
app.post('/create-user', function(req, res, next){
  var user = new User();
  // creating a new user
  user.profile.name = req.body.profile.name;
  user.password = req.body.password;
  user.profile.picture = req.body.profile.picture;
  user.email = req.body.email;
  user.address = req.body.address;
  user.save(function(err){
    if(err) return next(err);
    res.json('Successfully created a new user');
  });
})

// application entry point
app.get('/', function(req, res){
  res.render('home');
});

// listening on port 3000
app.listen(3000, function(err){
  if(err) throw err;
  console.log("Server is runnning on port 3000");
});
