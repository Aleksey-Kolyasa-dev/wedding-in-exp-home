var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);



// POST USER REGISTRATION
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
                    console.log('CALL POST BY: NEW USER REGISTRATION');
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

// POST USER LOGIN
usersRouter.post('/login', function (req, res, next) {
    var loginData = req.body;

    var promise = new Promise(function (resolve, reject) {
        // Get all users in DB
        usersDB.wedUsers.find({}, {}, function (e, users) {
            users.forEach(function (user) {
                // Check if such NAME already exists
                if (user.userName == loginData.name /*&& user.userPassword == loginData.password*/) {
                    user.isLogged = true;
                    user.lastLogin = new Date();
                    console.log('CALL POST BY: UPDATE USER DATA due to LOGIN');
                    res.json(user);
                    resolve(user);

                    /*usersDB.wedUsers.save(user, function (err, userA) {
                        if (err) {
                            reject(err);
                        }
                        else {
                     res.json(userA);
                     resolve(userA);
                        }
                    });*/
                    /*usersDB.wedUsers.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { isLogged: user.isLogged, lastLogin : user.lastLogin}}, {}, function (err, loggedUser) {
                        if(err){
                            res.send(err);
                        }
                        console.log('CALL POST BY: UPDATE USER DATA due to LOGIN');
                        res.json(loggedUser);
                        resolve(loggedUser);
                    });*/



                }
            });
            // If no coincides, do  RESOLVE
            reject(new UserNotFoundError('USER'));
        });
    });

    promise.then(
        function (user) {
            // Do save New Registred User in DB (if no rejects)
            console.log('CALL POST BY: /login', user);
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

// PUT Single Project BUDGET keyURL = /budgetNotes
usersRouter.put('/:id/userLoginStatus', function (req, res, next) {
    var user = req.body;
    console.log("CALL PUT BY: /budgetNotes");

    if(!user.userName){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: budgetNotes validation failed"
        });
    } else {
        usersDB.wedUsers.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { isLogged: user.isLogged, lastLogin : user.lastLogin}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
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

// USER NOT FOUND Error Ctor Fn
function UserNotFoundError(property) {
    Error.call(this, property);
    this.name = 'UserNotFoundError';
    this.property = property;
    this.message = "ERROR: " + property +" NOT FOUND!";
    if(Error.captureStackTrace){
        Error.captureStackTrace(this, UserNotFoundError);
    } else {
        this.stack = (new Error()).stack;
    }
}
UserNotFoundError.prototype = Object.create(Error.prototype);