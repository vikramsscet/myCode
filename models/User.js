var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/assistDB');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    firstName: String,
    lastName : String,
    mobileNumber : String,
    email : String,
    password : String
});

userSchema.statics.findUser = function(email, done) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	email = email.toLowerCase();
	return Users.findOne({ email: email }, done);
};

userSchema.statics.findAllUsers = function(done) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	return Users.find({}, done);
};

userSchema.statics.findUserById = function(id, done) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	return Users.findOne({ _id: id }, done);
};

userSchema.statics.AddUser = function(userDetail,done) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	var u = new Users(userDetail)
	return u.save(done);
};

userSchema.statics.updateUser = function(userDetail,done) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	
	Users.findOne({_id : userDetail['userId']}, function(err, user){
		if(err)
			console.log("error :- "+err);
		
		user.firstName = userDetail['fName'];
		user.lastName = userDetail['lName'];
		user.email = userDetail['email'];
		user.mobileNumber = userDetail['mobno'];
		return user.save(done);
	});
};

userSchema.statics.deleteUser = function(userId, callback) {
	mongoose.model('Users', userSchema);
	var Users = conn.model('Users');
	
	Users.findOne({_id : userId}, function(err, user){
		if(err)
			console.log("error :- "+err);
		
		return user.remove(callback);
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;