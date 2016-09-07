var Config = require('../models/Util');

var User = require('../models/User');
var utility = require('../models/Utility');

Config.app.get('/', function(req, res)
{
	var authObj = utility.getAuthentication(req, res);
	res.render('index', {
		title : 'New Idea...',
		userName : authObj.userName,
		cats : authObj.cats,
		subcats : authObj.subcats,
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
				req.session.loggedInUserId = user._id;
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
	var authObj = utility.getAuthentication(req, res);
	User.findAllUsers().exec().then(function(users) {
		res.render('users', {
			title : 'New Idea...',
			userName : authObj.userName,
			cats : authObj.cats,
			subcats : authObj.subcats,
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
	var authObj = utility.getAuthentication(req, res);
	res.render('admin', {
		title : 'New Idea...',
		cats : authObj.cats,
		subcats : authObj.subcats,
		userName : authObj.userName,
		error : ""
	});
});

Config.app.get('/testPage', function(req, res){
	res.render('testPage', {
		title : 'Test Page...',
		error : ""
	});
});

Config.app.get('/logoUpdate', function(req, res){
	var fileList = utility.showFiles();
	var authObj = utility.getAuthentication(req, res);
	res.render('logoUpdate', {
		title : 'Test Page...',
		cats : authObj.cats,
		subcats : authObj.subcats,
		userName : authObj.userName,
		error : "",
		fileList : fileList
	});
});

Config.app.post('/api/photo',function(req,res){
	utility.upload(req,res,function(err) {
		if(err) {
			return res.end(err);
		}
		res.end("File is uploaded");
	});
});

module.exports = Config.app;
