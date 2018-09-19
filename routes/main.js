var router = require('express').Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');
var stripe = require('stripe')('sk_test_s3Na0GfsNlXeGlri1Q62fGPy')
var async = require('async');

function paginate(req, res, next){
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
                    pages: count / perPage,
                    page: page
                });
            });
        });
}

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

router.get('/cart', function(req, res, next){
    Cart
    .findOne({ owner: req.user._id})
    .populate('items.item')
    .exec(function(err, found_cart){
        if(err) return next(err);
        res.render('main/cart', {
            found_cart: found_cart,
            message: req.flash('remove')
        });
    });
});

router.post('/product/:product_id', function(req, res, next){
    Cart.findOne({owner: req.user._id}, function(err, cart){
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.price_value),
            quantity: parseInt(req.body.quantity)
        });

        console.log(cart.total);
        console.log(parseFloat(req.body.price_value));
        cart.total = (cart.total + parseFloat(req.body.price_value)).toFixed(2);
        cart.save(function(err){
            if(err) return next(err);
            return res.redirect('/cart');
        });
    });
});

router.post('/payment', function(req, res, next){
    var stripe_token = req.body.stripe_token;
    var current_charges = Math.round(req.body.stripe_money * 100);

    // stripe.customers.create({
    //     source: stripe_token
    // }).then(function(customer){
    //     return stripe.charges.create({
    //         amount: current_charges,
    //         currency: 'usd',
    //         customer: customer.id
    //     });
    // });
    async.waterfall([
        function(callback){
            Cart.findOne({owner: req.user._id}, function(err, cart){
                callback(err, cart);
            })
        },
        function(cart, callback){
            User.findOne({_id: req.user._id}, function(err, user){
                if(user){
                    for(var i=0; i < cart.items.length; i++){
                        user.history.push({
                            item: cart.items[i].item,
                            paid: cart.items[i].price
                        });
                    }

                    user.save(function(err, user){
                        if(err) return next(err);
                        callback(err, user);
                    });
                }
            });
        },
        function(user){
            Cart.update({owner: user._id}, {$set: {items:[], total:0}}, function(err, updated){
                if(updated) {
                    res.redirect('/profile');
                }
            });
        }
    ]);
});

router.post('/remove', function(req, res, next){
    Cart.findOne({ owner: req.user._id}, function(err, found_cart){
        found_cart.items.pull(String(req.body.item));
        found_cart.total = (found_cart.total - parseFloat(req.body.price)).toFixed(2);
        found_cart.save(function(err, found){
            if (err) return next(err);
            req.flash('remove', 'Successfully removed');
            res.redirect('/cart');
        });
    });
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
        paginate(req, res, next);
    }
    else{
        res.render('main/home');
    }
});

router.get('/page/:page', function(req, res, next){
    paginate(req, res, next);
})

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
