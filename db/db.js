"use strict";
var mongojs = require('mongojs');

// ENVIRONMENT SWITCH Fn
function _envAPI() {
    // MAIN SET
    var apiDevEnvironment = true;

    // Auto
    return {
        _dev : apiDevEnvironment,
        get _projectsDB_URL(){
            if(apiDevEnvironment){
                return mongojs('mongodb://localhost:27017/weddings', ['weddings']); // mongodb://185.69.154.110:27017/wedUsers
            } else {
                //return mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);
                return mongojs('mongodb://185.69.154.110:27017/weddings', ['weddings']);
            }
        },
        get _usersDB_URL(){
            if(apiDevEnvironment){
                return mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
            } else {
                //return mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['wedUsers']);
                return mongojs('mongodb://185.69.154.110:27017/wedUsers', ['wedUsers']);
            }
        }
    };
}

module.exports = _envAPI;