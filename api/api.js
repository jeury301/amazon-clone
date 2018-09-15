var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');
var User = require('../models/user');

router.get('/:name', function(req, res, next){
  async.waterfall([
    function(callback){
      Category.findOne({name: req.params.name}, function(err, category){
        if(err) return next(errr);
        callback(null, category);
      })
    },
    function(category, callback){
      for(var i=0; i < 30; i++){
        var product = new Product();
        product.category = category._id;
        product.category_name = category.name;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = "https://picsum.photos/640/480/?"+faker.commerce.productName();
        product.save();
      }
    }
  ]);

  res.json({message: 'Success'});
})

module.exports = router;
