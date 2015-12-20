var Config = require('../models/Util');

var User = require('../models/User');
var Category = require('../models/Category');
var SubCategory = require('../models/SubCategory');
var categ;

Category.findAllCategories().exec().then(function(categories){
	categ = categories;
}).catch(function(err){
	console.log("Error !!! : "+err)
});

var subCateg=[];

SubCategory.findAllSubCategories().exec().then(function(subCats){
	for(var subCatindex in subCats){
		for(var catIndex in categ){
			if(subCats[subCatindex]['categoryId'] == categ[catIndex]['_id']){
				var subCatObj = {categoryId : "",categoryName : "", _id : "", subCategoryName : ""};
				subCatObj.categoryId = subCats[subCatindex]['categoryId'];
				subCatObj.categoryName = categ[catIndex]['categoryName'];
				subCatObj.subCategoryName = subCats[subCatindex]['subCategoryName'];
				subCatObj._id = subCats[subCatindex]['_id'];
				subCateg.push(subCatObj);
			}
		}
	}
	Config.subCateg = subCateg;
}).catch(function(err){
	console.log("Error !!! : "+err)
});

Config.app.get('/', function(req, res)
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
	res.render('index', {
		title : 'New Idea...',
		userName : uName,
		cats : cats,
		subcats : subcats,
		error : ""
	});
});

Config.app.post('/signUp', function(req, res)
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
	var subcats = req.session.subcategories;
	User.findUser(regData.email).exec().then(function(user){
		if(user === null){
			return User.AddUser(regData);
		}
		else
			throw "User already exists...";
	}).then(function(users){
		req.session.loggedInUserName = regData['email'];
		res.redirect("/");
	}).catch(function(err){
		res.render('index', {
			title : 'New Idea...',
			userName : "",
			cats : cats,
			subcats : subcats,
			error : {
				errorType : "signup",
				message : err
			}
		});
	});
});

Config.app.post('/signIn', function(req, res)
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
	User.findUser(loginDetail.email).exec().then(function(user){
		if(user === null) {
			res.render('index', {
				title: 'New Idea...',
				userName: "",
				cats: cats,
				subcats: subcats,
				error: {
					errorType: "login",
					message: "Please enter valid login credentials."
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
	}).catch(function(err){
		res.render('index', {
			title : 'New Idea...',
			userName : "",
			cats : cats,
			subcats : subcats,
			error : {
				errorType : "login",
				message : "Something bad happened."
			}
		});
	});
});

Config.app.get('/signout', function(req, res)
{
	req.session.loggedInUserName = "";
	res.redirect("/");
});

Config.app.get('/list', function(req, res){
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
	User.findAllUsers().exec().then(function(users) {
		res.render('users', {
			title : 'New Idea...',
			userName : uName,
			cats : cats,
			subcats : subcats,
			users : users,
			error : ""
		});
	}).catch(function(err){
		res.render('users', {
			title : 'New Idea...',
			userName : uName,
			cats : cats,
			subcats : subcats,
			users : users,
			error : err
		});
	});
});

Config.app.get('/find',function(req,res){
	var userId = req.param('id');
	User.findUserById(userId, function(error, user) {
		res.json(user);
	});
});

Config.app.post('/updateUser',function(req,res){
	User.updateUser(req.body, function(error, user) {
		res.json(user);
	});
});

Config.app.get('/deleteUser',function(req,res){
	var userId = req.param('id');
	User.deleteUser(userId, function(error, user) {
		res.json(user);
	});
});

Config.app.get('/admin', function(req, res){
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

module.exports = Config.app;
