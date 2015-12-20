var Config = require('../models/Util');

var categorySchema = new Config.Schema({
    categoryName: String
});

categorySchema.statics.findAllCategories = function(done) {
	var Categories = Config.conn.model('Categories');
	return Categories.find({}, done);
};

categorySchema.statics.findCategory = function(cat, done){
	var Categories = Config.conn.model('Categories');
	return Categories.findOne({ categoryName: cat }, done);
};

categorySchema.statics.findCategoryById = function(id, done) {
	var Categories = Config.conn.model('Categories');
	return Categories.findOne({ _id: id }, done);
};

categorySchema.statics.AddCategory = function(categoryDetail,done) {
	//mongoose.model('Categories', categorySchema);
	var Categories = Config.conn.model('Categories');
	var cat = new Categories(categoryDetail)
	return cat.save(done);
};

categorySchema.statics.deleteCategory = function(catId, callback) {
	var Categories = Config.conn.model('Categories');
	Categories.findOne({_id : catId}, function(err, cat){
		if(err)
			console.log("error :- "+err);
		return cat.remove(callback);
	});
}

categorySchema.statics.updateCategory = function(categoryDetail,done) {
	var Categories = Config.conn.model('Categories');
	
	Categories.findOne({_id : categoryDetail['catId']}, function(err, cat){
		if(err)
			console.log("error :- "+err);
		cat.categoryName = categoryDetail['catName'];
		return cat.save(done);
	});
};

var Category = Config.mongoose.model('Categories', categorySchema);

module.exports = Category;