var User = require('../models/user');
var router = require('express').Router();

router.get('/signup', function(req, res, next){
  res.render('accounts/signup');
});

router.post('/signup', function(req, res, next){
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  // find only one document in the user db
  User.findOne({email:req.body.email}, function(err, existingUser){
    if(existingUser){
      console.log(req.body.email + " already exists!");
      return res.redirect('/signup');
    } else{
      user.save(function(err, user){
        if(err) return next(err);
        res.json("New user has been created");
      });
    }
  });
});

module.exports = router;
