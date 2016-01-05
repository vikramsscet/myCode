var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var conn = mongoose.createConnection('mongodb://localhost:27017/assistDB');
var Schema = mongoose.Schema;

//var collectionList = ['usersCategories','categories', 'subcategories', 'users'];

/*var schemaList = [
                    {name : 'usersCategories', schemaDef : {userId :String, categoryId: String}},
                    {name : 'categories', schemaDef : {categoryName: String}},
                    {name : 'subcategories', schemaDef : {categoryId: String, subCategoryName : String}},
                    {name : 'users', schemaDef : {firstName: String, lastName : String, mobileNumber : String, email : String, password : String}}
                ];

setTimeout(function(){
    conn.db.listCollections().toArray(function(error, collections) {
        if (error) {
            throw new Error(error);
        } else {

            schemaList.forEach(function(schemaObj){
                var schemaExists = false;
                collections.forEach(function(obj){
                    if(schemaObj.name === obj.name){
                        schemaExists = true;
                    }
                });
                if(!schemaExists){
                    //createCollection(schemaObj.name, schemaObj.schemaDef);
                }
            });
        }
    });
},1000);

function createCollection(collectionName, schemaDef){
    console.log("creating collection : "+collectionName);
    mongoose.model(collectionName, schemaDef);
}*/

module.exports = {
    express : express,
    app : app,
    mongoose : mongoose,
    conn : conn,
    Schema : Schema
}