let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'User name required.']
	},
	email: {
		type: String,
		required: [true, 'Email required.']
	},
	password: {
		type: String,
		required: [true, 'Password required.']
	},
	timezone: {
		type: String,
		required: [true, 'Timezone required.']
	}			
}, {collection:'users'});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.updateUser = function(newUser, id, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
	    let item = {
		  username: newUser.username,
		  email: newUser.email,
	      password: hash,
	      timezone: newUser.timezone
		};
		User.findByIdAndUpdate(id, {$set: item}, {upsert: true, new: true, runValidators: true},callback);
    });
  });
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

module.exports.getUserByUsernameOrEmail = function(identifier, callback){
	User.findOne({$or:[ {'username': identifier.username}, {'email': identifier.email}]} , callback);
}

module.exports.deleteUserAccount = function(id, callback){
	User.findOneAndRemove({ _id: id }, callback);
}
