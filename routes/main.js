var router = require('express').Router();

// application entry point
router.get('/', function(req, res){
  res.render('main/home');
});

// about page
router.get('/about', function(req, res){
  res.render('main/about');
});

module.exports = router;
