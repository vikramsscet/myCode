
var Config = require('../models/Util');
var app = Config.app;
var Category = require('../models/Category');
var SubCategory = require('../models/SubCategory');
var usersCategory = require('../models/usersCategory');

var categ;
var subCateg = [];

app.get('/category', function(req, res){
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	categ = req.session.categories;
	subCateg = req.session.subcategories;
	var userId = req.session.loggedInUserId;
	res.render('category', {
		title : 'New Idea...',
		userName : uName,
		userId : userId,
		cats : categ,
		subcats : subCateg,
		error : ""
	});
});

app.get('/categoryList',function(req,res){
	res.json(req.session.categories);
});

app.post('/addCategory', function(req, res, next)
		{
			var catData = {
				categoryName : req.body.category
			};
			Category.findCategory(catData.categoryName, function(error, category){
				if(category===null){
					Category.AddCategory(catData,function(error, cats) {
						if(error){
							console.log("40...."+error);
						}	
						categ[categ.length] = cats;
						req.session.categories = categ;
						res.json(categ);
					});
				}
				else{
					res.json({error : "Category already exists."});
				}
			});
});

app.get('/deleteCategory',function(req,res){
	var catId = req.param('id');
	Category.deleteCategory(catId, function(error, category) {
		for(var i=0; i<categ.length; i++){
			if(categ[i]['categoryName'] == category['categoryName']){
				categ.splice(i,1);
			}
		}
		req.session.categories = categ;

		SubCategory.deleteSubCategoryByCategoryId(catId, function(error, subCat){
			for(var i = 0; i < subCateg.length; i++){
				if(subCateg[i]['categoryId'].toString() == catId.toString()){
					subCateg.splice(i,1);
					i--;
				}
			}
			req.session.subcategories = subCateg;
		});

		res.json(categ);
	});
});

app.get('/findCategoryById',function(req,res){
	var catId = req.param('id');
	Category.findCategoryById(catId, function(error, cat) {
		res.json(cat);
	});
});

app.post('/updateCategoryById',function(req,res){
	Category.updateCategory(req.body, function(error, cat) {
		for(var i=0; i<categ.length; i++){
			if(categ[i]['_id']+'' === cat['_id']+''){
				categ[i] = cat;
			}
		}
		for(var i = 0; i < subCateg.length; i++){
			if(subCateg[i]['categoryId'].toString() == req.body['catId'].toString()){
				subCateg[i]['categoryName'] = req.body['catName'];
			}
		}
		req.session.subcategories = subCateg;
		req.session.categories = categ;
		res.json(categ);
	});
});

app.get('/sub-category', function(req, res){
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	var cats = req.session.categories;
	categ = req.session.categories;
	var subcats = req.session.subcategories;
	subCateg = req.session.subcategories;
	res.render('subcategory', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		subcats : subcats,
		error : ""
	});
});

app.post('/addSubCategory', function(req, res)
		{
			var subCatData = {
				categoryId : req.body.categoryId,
				subCategoryName : req.body.subCategory
			};
			var categoryName = req.body.categoryName;
			SubCategory.findSubCategory(subCatData.subCategoryName, function(error, category){
				if(category===null){
					SubCategory.addSubCategory(subCatData,function(error, subCats) {
						if(error){
							console.log("40...."+error);
						}
						var newSubCatObj = {categoryId : "", categoryName : "", subCategoryName : "", _id : ""}
						newSubCatObj['categoryId'] = subCats['categoryId'];
						newSubCatObj['categoryName'] = categoryName;
						newSubCatObj['subCategoryName'] = subCats['subCategoryName'];
						newSubCatObj['_id'] = subCats['_id'];

						subCateg[subCateg.length] = newSubCatObj;
						req.session.subcategories = subCateg;
						res.json(subCateg);
					});
				}
				else{
					res.json({error : "Sub-Category already exists."});
				}
			});
});

app.get('/findSubCategoryById',function(req,res){
	var subCatId = req.param('id');
	SubCategory.findSubCategoryById(subCatId, function(error, cat) {
		res.json(cat);
	});
});

app.get('/deleteSubCategory',function(req,res){
	var subCatId = req.param('id');
	SubCategory.deleteSubCategory(subCatId, function(error, subCategory) {
		for(var i=0; i<subCateg.length; i++){
			if(subCateg[i]['subCategoryName'] == subCategory['subCategoryName']){
				subCateg.splice(i,1);
			}
		}
		req.session.subcategories = subCateg;
		res.json(subCateg);
	});
});

app.post('/updateSubCategoryById',function(req,res){
	SubCategory.updateSubCategory(req.body, function(error, subcat) {
		for(var subCatIndex in subCateg){
			if(subcat['_id'].toString() == subCateg[subCatIndex]['_id'].toString()){
				subCateg[subCatIndex]['categoryName'] = req.body['catName'];
				subCateg[subCatIndex]['subCategoryName'] = subcat['subCategoryName'];
				subCateg[subCatIndex]['categoryId'] = subcat['categoryId'];
			}
		}
		req.session.subcategories = subCateg;
		res.json(subCateg);
	});
});

app.get('/article', function(req,res){
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	var body = {
			cat : req.query.cat,
			subCat : req.query.subCat
		};
	console.log(body);
	var cats = req.session.categories;
	var subcats = req.session.subcategories;
	res.render('article', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		subcats : subcats,
		body : body,
		error : ""
	});
});

app.post('/addUserCategory', function(req, res) {
	var data = usersCategory.addUserCategory(req.body);
	res.json(data);
});

app.post('/removeUserCategory', function(req, res) {
	var data = usersCategory.removeUserCategory(req.body);
	res.json(data);
})

module.exports = app;