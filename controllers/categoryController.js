var express = require('express');
var app = express.Router();

//var User = require('../models/User');
var Category = require('../models/Category');
var SubCategory = require('../models/SubCategory');
var categ;
Category.findAllCategories(function(error, cats) {
	categ = cats;
});
var subCateg;
SubCategory.findAllSubCategories(function(error, subCats){
	subCateg = subCats;
});
app.get('/category', function(req, res){
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	if(req.session.categories == null || req.session.categories == undefined){
		req.session.categories = categ;
	}
	if(req.session.subcategories == null || req.session.subcategories == undefined){
		req.session.subcategories = subCateg;
	}
	var cats = req.session.categories;
	var subcats = req.session.subcategories;
	res.render('category', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		subcats : subcats,
		error : ""
	});
});

app.get('/categoryList',function(req,res){
	res.json(categ);
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
	if(req.session.categories == null || req.session.categories == undefined){
		req.session.categories = categ;
	}
	var cats = req.session.categories;
	if(req.session.subcategories == null || req.session.subcategories == undefined){
		req.session.subcategories = subCateg;
	}
	var subcats = req.session.subcategories;
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
				categoryName : req.body.category,
				subCategoryName : req.body.subCategory
			};
			SubCategory.findSubCategory(subCatData.subCategoryName, function(error, category){
				if(category===null){
					SubCategory.addSubCategory(subCatData,function(error, subCats) {
						if(error){
							console.log("40...."+error);
						}	
						subCateg[subCateg.length] = subCats;
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
		for(var i=0; i<subCateg.length; i++){
			if(subCateg[i]['_id']+'' === subcat['_id']+''){
				subCateg[i] = subcat;
			}
		}
		req.session.subcategories = subCateg;
		res.json(subCateg);
	});
});

module.exports = app;