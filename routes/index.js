var express = require('express');
var app = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var NodeCache = require( "node-cache" );
var User = require('../models/User');
var Category = require('../models/Category');

var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/assistDB';

var cats;
Category.findAllCategories(function(error, cats) {
	cats = cats;
	console.log(cats);
});
console.log(cats);

/* GET home page. */
app.get('/', function(req, res)
{
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	var cats;
	console.log(req.session.categories);
	if(req.session.categories == null || req.session.categories == undefined){
		console.log("--------------------");
		Category.findAllCategories(function(error, cats) {
			cats = cats;
		});
	}
	req.session.categories = cats;
	console.log(cats);
	res.render('index', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		error : ""
	});
});

app.post('/signUp', function(req, res, next)
{
	var regData = {
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		mobileNumber : req.body.mobileNumber,
		email : req.body.newemail,
		password : req.body.newpwd
	};
	
	var cats;
	if(req.session.categories === null){
		Category.findAllCategories(function(error, cats) {
			req.session.categories = cats;
		});
	}
	cats = req.session.categories;
	
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
	var cats;
	if(req.session.categories === null){
		Category.findAllCategories(function(error, cats) {
			req.session.categories = cats;
		});
	}
	cats = req.session.categories;
	User.findUser(loginDetail.email, function(error, user){
		if(user === null){
			res.render('index', {
				title : 'New Idea...',
				userName : "",
				cats : cats,
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
	var cats;
	if(req.session.categories === null){
		Category.findAllCategories(function(error, cats) {
			req.session.categories = cats;
		});
	}
	cats = req.session.categories;
	User.findAllUsers(function(error, users) {
		res.render('users', {
			title : 'New Idea...',
			userName : uName,
			cats : cats,
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
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	var cats;
	if(req.session.categories === null){
		Category.findAllCategories(function(error, cats) {
			req.session.categories = cats;
		});
	}
	cats = req.session.categories;
	res.render('admin', {
		title : 'New Idea...',
		cats : cats,
		userName : uName,
		error : ""
	});
});
app.get('/category', function(req, res){
	var uName = "";
	if (req.session.loggedInUserName !== null && req.session.loggedInUserName !== undefined)
	{
		uName = req.session.loggedInUserName;
	}
	var cats;
	if(req.session.categories === null){
		Category.findAllCategories(function(error, cats) {
			req.session.categories = cats;
		});
	}
	cats = req.session.categories;
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
						res.json(cats);
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
		res.json(category);
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
		res.json(cat);
	});
});

module.exports = app;
