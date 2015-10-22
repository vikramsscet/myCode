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

subCategorySchema.statics.findSubCategoryById = function(id, done) {
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

subCategorySchema.statics.deleteSubCategory = function(subCatId, callback) {
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	SubCategories.findOne({_id : subCatId}, function(err, subCat){
		if(err)
			console.log("error :- "+err);
		return subCat.remove(callback);
	});
}

subCategorySchema.statics.updateSubCategory = function(subCategoryDetail,done) {
	mongoose.model('SubCategories', subCategorySchema);
	var SubCategories = conn.model('SubCategories');
	
	SubCategories.findOne({_id : subCategoryDetail['subCatId']}, function(err, subCat){
		if(err)
			console.log("error :- "+err);
		subCat.categoryName = subCategoryDetail['catName'];
		subCat.subCategoryName = subCategoryDetail['subCatName'];
		return subCat.save(done);
	});
};

var SubCategory = mongoose.model('SubCategories', subCategorySchema);

module.exports = SubCategory;