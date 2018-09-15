var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      es_type: 'text'
  },
  name: {
      type:String,
      es_type: 'text'
  },
  price: {
      type:Number,
      es_type:"long"
  },
  image: {
      type:String,
      es_type: 'text'
  },
  category_name: {
      type:String,
      es_type: 'text'
  }
});

ProductSchema.plugin(mongoosastic, {
    hosts: [
        'localhost:9200'
    ]
});


module.exports = mongoose.model('Product', ProductSchema);
