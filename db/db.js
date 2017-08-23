/*
var mongoose = require('mongoose');

// MongoDB
//'mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db'
//'mongodb://localhost:27017/weddings'

var db = mongoose.createConnection('mongodb://localhost:27017/weddings');

// DB handlers
db.on("error", console.log.bind(console, "connection to DB error"));
db.once("open", function () {
    console.log("DB connected");
});

module.exports = db;*/
"use strict";

// ENVIRONMENT SWITCH Fn
function _envAPI() {
    // MAIN SET
    var apiDevEnvironment = true;

    // Auto
    return {
        _dev : apiDevEnvironment,
        get _projectsDB_URL(){
            if(apiDevEnvironment){
                return 'http://localhost:5000/api/';
            } else {
                return 'https://wedding-in.herokuapp.com/api/';
            }
        },
        get _usersDB_URL(){
            if(apiDevEnvironment){
                return 'http://localhost:5000/users/';
            } else {
                return 'https://wedding-in.herokuapp.com/users/';
            }
        }
    };
}
