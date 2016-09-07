/**
 * Created by raov on 31/08/16.
 */
var Config = require('../models/Util');
var fs = require('fs');
var multer  =   require('multer');
var mkdirp = require('mkdirp');
var Category = require('../models/Category');
var SubCategory = require('../models/SubCategory');

var utilityObject = function(){
    var categ, subCateg=[], bannerDirectory = "./tmp/foo/bar/baz";
    var createDirectory = function(){
        mkdirp('./tmp/foo/bar/baz', function (err) {
            if (err) console.error(err)
            else console.log('pow!')
        });
    }
    var removeOldBannerImage = function(){
        var files = fs.readdirSync(bannerDirectory);
        files.forEach(function(file){
            fs.unlink(bannerDirectory+'/'+file, function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
            })
        });
    }
    var storageParams = {
        destination: function (req, file, callback) {
            createDirectory();
            removeOldBannerImage();
            callback(null, bannerDirectory);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    };

    this.storage = multer.diskStorage(storageParams);
    this.upload = multer({
                    storage : this.storage
                    }).single('userPhoto');
    this.showFiles = function(){
        var files = fs.readdirSync(bannerDirectory);
        return files;
    }

    var fileExistanceFlag = function(fileName){
        var files = this.showFiles();
        if(files.indexOf(fileName) == -1)
            return true;
        else
            return false;
    }

    this.getAuthentication = function(req, res){
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

        return {
            userName : uName,
            cats : cats,
            subcats : subcats
        }
    }
    this.setCategoryAndSubCategory = function(){

        Category.findAllCategories().exec().then(function(categories){
            categ = categories;
        }).catch(function(err){
            console.log("Error !!! : "+err)
        });

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
    }
    this.setCategoryAndSubCategory();

}

module.exports = new utilityObject();


