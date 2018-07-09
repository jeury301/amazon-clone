var router = require('express').Router();
var Product = require('../models/product')

// application entry point
router.get('/', function(req, res){
  res.render('main/home');
});

// about page
router.get('/about', function(req, res){
  res.render('main/about');
});

// products for each category
router.get('/products/:id', function(req, res, next){
  Product
    .find({category: req.params.id})
    .populate('category')
    .exec(function(err, products){
      if(err) return next(err);
      res.render('main/category', {
        products: products
      });
    });
});

module.exports = router;
