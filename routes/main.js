var router = require('express').Router();
var Product = require('../models/product')

// bridge between the product db and the elastic-search replica set
Product.createMapping(function(err, mapping){
    if(err){
        console.log("error creating mapping");
        console.log(err);
    } else {
        console.log("Mapping created");
        console.log(mapping);
    }
})

// sending data to elasticsearch
var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
    count++;
});

stream.on('close', function(){
    console.log("Indexed "+count+" documents");
});

stream.on('error', function(err){
    console.log(err);
});

router.post('/search', function(req, res, next){
    res.redirect('/search?q='+req.body.q);
});

// Searching documents using elasticsearch
router.get('/search', function(req, res, next){
    if(req.query.q){
        Product.search({
            query_string: {query: req.query.q}
        }, function(err, results){
            if(err) return next(err);
            var data = results.hits.hits.map(function(hit){
                return hit;
            });

            // rendering the data under ejs stuff
            res.render('main/search-result', {
                query: req.query.q,
                data: data
            });
        });
    }
});

// application entry point
router.get('/', function(req, res, next){

    // If user is logged in, display a pagination view
    // of the products
    if (req.user){
        var perPage = 9;
        var page = req.params.page;

        Product
            .find()
            .skip(perPage * page)
            .limit(perPage)
            .populate('category')
            .exec(function(err, products){
                if (err) return next();
                Product.count().exec(function(err, count){
                    if (err) return next();

                    res.render('main/product-main', {
                        products: products,
                        pages: count / perPage
                    });
                });
            });
    }
    else{
        res.render('main/home');
    }
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

// specific product
router.get('/product/:id', function(req, res, next){
  Product.findById({_id: req.params.id}, function(err, product){
    if(err) next(err);
    res.render('main/product', {
      product:product
    });
  });
});

module.exports = router;
