// loading third-party packages
var express = require('express'); // web framework for node.js
var morgan = require('morgan'); // console logging for http requests
var mongoose = require('mongoose'); // mongodb ORM
var bodyParser = require('body-parser'); // http request parser
var ejs = require('ejs'); // templating engine
var engine = require('ejs-mate'); // ejs extension for flashy stuff ¯\_(ツ)_/¯
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

// loading application-related packages
var User = require('./models/user');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
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
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev')); // logging changes on server
app.use(bodyParser.json()); // application can now parse json data
app.use(bodyParser.urlencoded({extended: true})) // application can now parse urlencoded data
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "amazon-clone-secret"
}))
app.use(flash());
app.engine('ejs', engine); // setting the type of engine to ejs
app.set('view engine', 'ejs'); // setting ejs
app.use(mainRoutes); // setting up main routes
app.use(userRoutes); // setting up user routes

// listening on port 3000
app.listen(3000, function(err){
  if(err) throw err;
  console.log("Server is runnning on port 3000");
});
