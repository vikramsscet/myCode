var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/assistDB');
var Schema = mongoose.Schema;
var subCategorySchema = new Schema({
    categoryName: String,
    subCategoryName : String
});

subCategorySchema.statics.findAllSubCategories = function(done) {
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	return SubCategories.find({}, done);
};

subCategorySchema.statics.findSubCategory = function(subCat, done){
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	return SubCategories.findOne({ subCategoryName: subCat }, done);
};

subCategorySchema.statics.findCategoryById = function(id, done) {
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	return SubCategories.findOne({ _id: id }, done);
};

subCategorySchema.statics.addSubCategory = function(subCategoryDetail,done) {
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	var subCat = new SubCategories(subCategoryDetail);
	return subCat.save(done);
};

/*categorySchema.statics.deleteCategory = function(catId, callback) {
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
};*/

var SubCategory = mongoose.model('SubCategories', subCategorySchema);

module.exports = SubCategory;