var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var conn = mongoose.createConnection('mongodb://localhost:27017/assistDB');
var Schema = mongoose.Schema;

module.exports = {
    express : express,
    app : app,
    mongoose : mongoose,
    conn : conn,
    Schema : Schema
}