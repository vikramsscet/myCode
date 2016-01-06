var Config = require('../models/Util');

var usersCategorySchema = new Config.Schema({
    userId :String,
    categoryId: String
});

usersCategorySchema.statics.addUserCategory = function(userCategoryDetail, done) {
    var usersCategories = Config.conn.model('usersCategories');
    var userCat = new usersCategories(userCategoryDetail);
    return userCat.save(done);
};

usersCategorySchema.statics.removeUserCategory = function(userCategoryDetail, done) {
    var usersCategories = Config.conn.model('usersCategories');
    usersCategories.findOne(userCategoryDetail, function(err, userCat){
        if(err)
            console.log("error :- "+err);
        return userCat.remove(done);
    });
};

usersCategorySchema.statics.getUserCategory = function(userId, done) {
    var usersCategories = Config.conn.model('usersCategories');
    return usersCategories.find(userId, done);
};

var UserCategorySchema = Config.mongoose.model('usersCategories', usersCategorySchema);

module.exports = UserCategorySchema;