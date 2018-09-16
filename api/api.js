var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');
var User = require('../models/user');

router.post('/search', function(req, res, next){
    Product.search({
        query_string: { query: req.body.search_term}
    }, function(err, results){
        if (err) return next(err);
        res.json(results);
    });
});

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
        var name = faker.commerce.productName();
        product.category = category._id;
        product.category_name = category.name;
        product.name = name
        product.price = faker.commerce.price();
        product.image = "https://picsum.photos/640/480/?"+name;
        product.save();
      }
    }
  ]);

  res.json({message: 'Success'});
})

module.exports = router;
