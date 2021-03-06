// loading packages
var mongoose = require('mongoose'); // ORM - object relational mapper
var bcrypt = require('bcrypt-nodejs'); // hashing library
var crypto = require('crypto');
var Schema = mongoose.Schema

/* The user schema attributes */
var UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,
  profile: {
    name: {type: String, default: ''},
    picture: {type: String, default: ''}
  },
  address: String,
  history: [{
    paid: {type: Number, default:0},
    item: {type: Schema.Types.ObjectId, ref: 'Product'}
  }]

});

/* The user schemea built-in methods */
// hashing the password before storing it in the db
UserSchema.pre('save', function(next){
  var user = this;
  // check if the password was not changed
  if(!user.isModified('password')) return next();
  // password was changed - we have to process it
  // creating the SALT using bcrypt
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    // hashing the password
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);
      // hash contains the hashed password
      user.password = hash;
      // returning the callback with no parameters
      // which means the hash was a success
      next();
    });
  });
});

/* The user schema actions user-defined methods */
// comparing user-typed password with db-password
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size){
  if(!this.size) size = 200;
  if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=retro';

}

// exporting module
module.exports = mongoose.model('User', UserSchema);
