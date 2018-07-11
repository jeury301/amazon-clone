var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');
var User = require('../models/user');

router.get("/categories", function(req, res, next){
  res.json({"categories":res.app.locals.categories})
})

router.post("/category", function(req, res, next){
  var category = req.body.category;
  Category.find({"name":category}, function(err, category){
    if(err) next(err);
    res.json({"category":category})
  })
})

module.exports = router;
