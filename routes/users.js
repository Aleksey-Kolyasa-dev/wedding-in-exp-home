var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// POST Single Project
usersRouter.post('/', function (req, res, next) {
    var newUser = req.body;
    var nameExist = false;

    if (!newUser.userName || !newUser.userEmail || !newUser.userPassword) {
        res.status(400);
        res.json({
            "error": "POST ERROR: not all required fields was filled in"
        });
    } else {

        usersDB.wedUsers.find(function (err, users) {
            if (err) {
                res.send(err);
            } else {
                users.forEach(function (userInDB) {
                    if (userInDB.userName == newUser.userName) {
                        nameExist = true;
                    }
                });

                if (!nameExist) {
                    usersDB.wedUsers.save(newUser, function (err, registredUser) {
                        if (err) {
                            res.send(err);
                        }
                        console.log('CALL by: POST NEW USER');
                        res.json(registredUser);
                    });
                } else {
                    console.log('ERROR: NAME ALREADY EXIST');
                    res.send(nameExist);
                }
            }
        });


    }
});





module.exports = usersRouter;