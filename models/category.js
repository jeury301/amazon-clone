var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
      type:String,
      es_type: 'text',
      unique: true,
      lowercase:true,
  }
});

// assign a function to the "methods" object of our animalSchema
 CategorySchema.methods.findAll = function(cb) {
   return this.model('Category').find({ }, cb);
 };


module.exports = mongoose.model('Category', CategorySchema);
