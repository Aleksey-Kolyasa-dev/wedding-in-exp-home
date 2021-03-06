"use strict";
var mongojs = require('mongojs');

// ENVIRONMENT SWITCH Fn
function _envAPI() {
    // MAIN SET
    var apiDevEnvironment = false;

    // Auto
    return {
        _dev : apiDevEnvironment,
        get _projectsDB_URL(){
            if(apiDevEnvironment){
                return mongojs('mongodb://localhost:27017/weddings', ['weddings']);
            } else {
                return mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);
            }
        },
        get _usersDB_URL(){
            if(apiDevEnvironment){
                return mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
            } else {
                return mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['wedUsers']);
            }
        }
    };
}

module.exports = _envAPI;