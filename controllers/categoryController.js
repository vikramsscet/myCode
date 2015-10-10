var express = require('express');
var app = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');

var categ;
Category.findAllCategories(function(error, cats) {
	categ = cats;
	console.log(categ);
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
	var cats = req.session.categories;
	res.render('category', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		error : ""
	});
});

app.post('/addCategory', function(req, res, next)
		{
			var catData = {
				categoryName : req.body.category
			};
			Category.findCategory(catData.categoryName, function(error, category){
				console.log(category);
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

module.exports = app;