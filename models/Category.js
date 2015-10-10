var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/assistDB');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    categoryName: String
});

categorySchema.statics.findAllCategories = function(done) {
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	return Categories.find({}, done);
};

categorySchema.statics.findCategory = function(cat, done){
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	return Categories.findOne({ categoryName: cat }, done);
};

categorySchema.statics.findCategoryById = function(id, done) {
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	return Categories.findOne({ _id: id }, done);
};

categorySchema.statics.AddCategory = function(categoryDetail,done) {
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	var cat = new Categories(categoryDetail)
	return cat.save(done);
};

categorySchema.statics.deleteCategory = function(catId, callback) {
	console.log(catId);
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	Categories.findOne({_id : catId}, function(err, cat){
		if(err)
			console.log("error :- "+err);
		return cat.remove(callback);
	});
}

categorySchema.statics.updateCategory = function(categoryDetail,done) {
	mongoose.model('Categories', categorySchema);
	var Categories = conn.model('Categories');
	
	Categories.findOne({_id : categoryDetail['catId']}, function(err, cat){
		if(err)
			console.log("error :- "+err);
		cat.categoryName = categoryDetail['catName'];
		return cat.save(done);
	});
};

var Category = mongoose.model('Categories', categorySchema);

module.exports = Category;