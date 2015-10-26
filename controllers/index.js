var express = require('express');
var app = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var SubCategory = require('../models/SubCategory');
var categ;
Category.findAllCategories(function(error, cats) {
	categ = cats;
});
var subCateg;
/*SubCategory.findAllSubCategories(function(error, subCats){
	subCateg = subCats;
});*/
SubCategory.findAllSubCategories(function(error, subCats){
	for(var subCatindex in subCats){
		for(var catIndex in categ){
			if(subCats[subCatindex]['categoryId'] == categ[catIndex]['_id']){
				subCats[subCatindex].categoryName = categ[catIndex]['categoryName'];
			}
		}
	}
	subCateg = subCats;
});
app.get('/', function(req, res)
{
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
	console.log(subcats);
	res.render('index', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		subcats : subcats,
		error : ""
	});
});

app.post('/signUp', function(req, res)
{
	var regData = {
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		mobileNumber : req.body.mobileNumber,
		email : req.body.newemail,
		password : req.body.newpwd
	};
	if(req.session.categories == null || req.session.categories == undefined){
		req.session.categories = categ;
	}
	var cats = req.session.categories;
	User.findUser(regData.email, function(error, user){
		if(user===null){
			User.AddUser(regData,function(error, users) {
				if(error){
					console.log("40...."+error);
				}
				req.session.loggedInUserName = regData['email'];
				res.redirect("/");
			});
		}
		else{
			res.render('index', {
				title : 'New Idea...',
				userName : "",
				cats : cats,
				error : {
					errorType : "signup",
					message : "Email already exists..."
				}
			});
		}
	});
});

app.post('/signIn', function(req, res)
{
	var loginDetail = {
		email : req.body.email,
		password : req.body.pwd
	};
	if(req.session.categories == null || req.session.categories == undefined){
		req.session.categories = categ;
	}
	var cats = req.session.categories;
	if(req.session.subcategories == null || req.session.subcategories == undefined){
		req.session.subcategories = subCateg;
	}
	var subcats = req.session.subcategories;
	User.findUser(loginDetail.email, function(error, user){
		if(user === null){
			res.render('index', {
				title : 'New Idea...',
				userName : "",
				cats : cats,
				subcats : subcats,
				error : {
					errorType : "login",
					message : "Please enter valid login credentials."
				}
			});
		}else{
			if(user.password != loginDetail.password){
				res.render('index', {
					title : 'New Idea...',
					userName : "",
					cats : cats,
					subcats : subcats,
					error : {
						errorType : "login",
						message : "Please enter valid login credentials."
					}
				});
			}else{
				req.session.loggedInUserName = loginDetail.email;
				res.redirect("/");
			}
		}
	});
});

app.get('/signout', function(req, res)
{
	req.session.loggedInUserName = "";
	res.redirect("/");
});

app.get('/list', function(req, res){
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
	User.findAllUsers(function(error, users) {
		res.render('users', {
			title : 'New Idea...',
			userName : uName,
			cats : cats,
			subcats : subcats,
			users : users,
			error : ""
		});
	});
});

app.get('/find',function(req,res){
	var userId = req.param('id');
	User.findUserById(userId, function(error, user) {
		res.json(user);
	});
});

app.post('/updateUser',function(req,res){
	User.updateUser(req.body, function(error, user) {
		res.json(user);
	});
});

app.get('/deleteUser',function(req,res){
	var userId = req.param('id');
	User.deleteUser(userId, function(error, user) {
		res.json(user);
	});
});

app.get('/admin', function(req, res){
	var uName = "";
	if(req.session.loggedInUserName == null && req.session.loggedInUserName == undefined){
		res.redirect("/");
	}
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
	res.render('admin', {
		title : 'New Idea...',
		cats : cats,
		subcats : subcats,
		userName : uName,
		error : ""
	});
});

module.exports = app;
