var passport = require('passport'); // social login - facebook, twitter, etc
var LocalStrategy = require('passport-local').Strategy(); // local login

// serialize and deserialize the user object
passport.serializeUser(function(user, done){
  // translating user object into a format to be stored
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  })
})

// middleware
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallBack: true
},function(req, email, password, done){
  User.findOne({email: email}, function(err, user){
    // checking for errors
    if(err) return done(err);
    // checking for user existence
    if(!user) return done(null, false, req.flash('loginMessage', 'No user has been found'))
    // validating password
    if(!user.comparePassword(password)){
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password pal'));
    }
    // everything is OK - it is a go.
    return done(null, user);
  });
}));

// custom function to validate
exports.isAuthenticated = function(req, res, , next){
  if(req.isAuthenticated()) return next();

  res.redirect('/login');
}
