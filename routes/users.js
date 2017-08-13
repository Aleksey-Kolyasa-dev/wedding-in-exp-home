var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// POST Single Project
usersRouter.post('/', function (req, res, next) {
    var newUser = req.body;
    var promise = new Promise(function (resolve, reject) {

        usersDB.wedUsers.find({}, {}, function (e, users) {
            users.forEach(function (user) {
                if (user.userName == newUser.userName) {
                    reject(new Error('Name already occupied'));
                }
            });
            resolve(users);
        });
    });

    promise.then(
        function () {
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
        function (err) {
            console.log(err);
            res.send(err);
        }
    ).catch(function (err) {
        console.log(err);
        res.write(err);
    });
});


module.exports = usersRouter;