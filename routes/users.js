var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);



// POST Single Project
usersRouter.post('/', function (req, res, next) {
    var newUser = req.body;



    var promise = new Promise(function (resolve, reject) {
        // Get all users in DB
        usersDB.wedUsers.find({}, {}, function (e, users) {
            users.forEach(function (user) {
                // Check if such NAME already exists
                if (user.userName == newUser.userName) {
                    reject(new PropOccupiedError('NAME'));
                }
                // Check if such EMAIL already exists
                if (user.userEmail == newUser.userEmail) {
                    reject(new PropOccupiedError('EMAIL'));
                }
            });
            // If no coincides, do  RESOLVE
            resolve();
        });
    });

    promise.then(
        function () {
            // Do save New Registred User in DB (if no rejects)
            usersDB.wedUsers.save(newUser, function (err, registredUser) {
                if (err) {
                    res.send(err);
                }
                else {
                    console.log('CALL by: POST NEW USER');
                    res.json(registredUser);
                }
            });
        },
        // if rejected, send an error
        function (err) {
            console.log(err);
            res.send(err);
        }
    ).catch(function (err) {
        console.log(err);
        res.send(err);
    });
});


module.exports = usersRouter;

// Occupation Error Ctor Fn
function PropOccupiedError(property) {
    Error.call(this, property);
    this.name = 'PropOccupiedError';
    this.property = property;
    this.message = "ERROR: Such " + property +" already occupied";
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, PropOccupiedError);
    } else {
        this.stack = (new Error()).stack;
    }
}
PropOccupiedError.prototype = Object.create(Error.prototype);