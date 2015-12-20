var Config = require('../models/Util');

var subCategorySchema = new Config.Schema({
    categoryId: String,
    subCategoryName : String
});

subCategorySchema.statics.findAllSubCategories = function(done) {
	var SubCategories = Config.conn.model('SubCategories');
	return SubCategories.find({}, done);
};

subCategorySchema.statics.findSubCategory = function(subCat, done){

	var SubCategories = Config.conn.model('SubCategories');
	return SubCategories.findOne({ subCategoryName: subCat }, done);
};

subCategorySchema.statics.findSubCategoryById = function(id, done) {

	var SubCategories = Config.conn.model('SubCategories');
	return SubCategories.findOne({ _id: id }, done);
};

subCategorySchema.statics.addSubCategory = function(subCategoryDetail,done) {

	var SubCategories = Config.conn.model('SubCategories');
	var subCat = new SubCategories(subCategoryDetail);
	return subCat.save(done);
};

subCategorySchema.statics.deleteSubCategory = function(subCatId, callback) {

	var SubCategories = Config.conn.model('SubCategories');
	SubCategories.findOne({_id : subCatId}, function(err, subCat){
		if(err)
			console.log("error :- "+err);
		return subCat.remove(callback);
	});
}

subCategorySchema.statics.deleteSubCategoryByCategoryId = function(catId, callback){

	var SubCategories = Config.conn.model('SubCategories');
	SubCategories.find({categoryId : catId.toString()}, function(err, subCat){
		if(err)
			console.log("error :- "+err);

		for(var i = 0; i < subCat.length; i++){
			console.log(subCat[i]);
			subCat[i].remove();
		}
		callback();
	});
}

subCategorySchema.statics.updateSubCategory = function(subCategoryDetail,done) {

	var SubCategories = Config.conn.model('SubCategories');
	
	SubCategories.findOne({_id : subCategoryDetail['subCatId']}, function(err, subCat){
		if(err)
			console.log("error :- "+err);
		subCat.categoryId = subCategoryDetail['catId'];
		subCat.subCategoryName = subCategoryDetail['subCatName'];
		return subCat.save(done);
	});
};

var SubCategory = Config.mongoose.model('SubCategories', subCategorySchema);

module.exports = SubCategory;