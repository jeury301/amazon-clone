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
var MongoStore = require('connect-mongo')(session);
var passport = require('passport'); // authentication library

// loading application-related packages
var config = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');
var publicRoutes = require('./routes/public');

var cartLen = require('./middlewares/middlewares');

// creating express application
var app = express();

const options = {
  useNewUrlParser: true
}

// connecting to mongolab DB
mongoose.connect(config.database,options,function(err){
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
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8101');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secretKey,
  store: new MongoStore({url:config.database, autoReconnect:true})
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.app.locals.user = req.user;
  next();
})

app.use(cartLen);

app.use(function(req, res, next){
  Category.find({}, function(err,categories){
    if(err) return next(err)
    res.app.locals.categories = categories;
    next();
  })
})

app.engine('ejs', engine); // setting the type of engine to ejs
app.set('view engine', 'ejs'); // setting ejs
app.use(mainRoutes); // setting up main routes
app.use(userRoutes); // setting up user routes
app.use(adminRoutes); // setting up admin routes
app.use('/public', publicRoutes);
app.use('/api', apiRoutes);

// listening on port 3000
app.listen(config.port, function(err){
  if(err) throw err;
  console.log("Server is runnning on port 3000");
});
