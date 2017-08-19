var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// CONFIG
var collection = 'wedUsers';


/*
 * USERS ROUTER
 * */

// POST USER REGISTRATION
usersRouter.post('/', function (req, res, next) {
    var newUser = req.body;

    var promise = new Promise(function (resolve, reject) {
        // Get all users in DB
        usersDB[collection].find({}, {}, function (e, users) {
            users.forEach(function (user) {
                // Check if such NAME already exists
                if (user.login == newUser.login) {
                    reject(new PropOccupiedError('LOGIN'));
                }
                // Check if such EMAIL already exists
                if (user.email == newUser.email) {
                    reject(new PropOccupiedError('EMAIL'));
                }
            });
            // If no coincides, do  RESOLVE
            resolve();
        });
    });

    promise.then(
        function () {
            if(!newUser.login || !newUser.password || !newUser.email){
                reject(new NewUserValidationError('VALIDATION'));
            } else {
                // Do save New Registred User in DB (if no rejects)
                usersDB[collection].save(new User(newUser), function (err, registredUser) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log('CALL POST BY: NEW USER: ' + newUser.name +' REGISTRED');
                        res.json(registredUser);
                    }
                });
            }
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
        usersDB[collection].find({}, {}, function (e, users) {
            users.forEach(function (user) {
                // Check if such USER exists
                if (user.login == loginData.login && user.password == loginData.password) {

                    // Update LOGIN STATUS
                    user.isLogged = true;
                    user.lastLogin = new Date();
                    user.isAuth = true;
                    console.log('CALL POST BY: LOGIN, user: ' + user.name);
                    
                    // Do current Promise chain resolved
                    resolve(user);
                    
                    // Send USER to Client
                    res.json(user);
                    
                    // Do USER LOGIN STATUS update to DB
                    usersDB[collection].update({_id: mongojs.ObjectId(user._id)}, {
                        $set: {
                            isLogged: user.isLogged,
                            lastLogin: user.lastLogin,
                            isAuth : user.isAuth
                        }
                    }, {}, function (err, data) {
                        if (err) {
                            res.send(err);
                        }
                        console.log('LOGIN STATUS UPDATE: OK');
                    });
                }
            });
            // If no coincides, do  REJECT - USER NOT FOUND!
            reject(new UserNotFoundError('USER'));
        });
    });

    promise.then(
        function (success) {
            // If all ok (no rejects)
            console.log('LOGIN SUCCESS');
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

// PUT USER LOGOUT
usersRouter.put('/:id/logout', function (req, res, next) {
    var user = req.body;
    console.log('CALL PUT BY: LOGOUT, user: ' + user.name);

    if(!user._id){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: LOGOUT validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, { $set : { isLogged : user.isLogged, isAuth : user.isAuth}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});

/*// PUT USER smsQTY
usersRouter.put('/:id/smsQty', function (req, res, next) {
    var user = req.body;
    console.log("PUT PUT BY: /smsQty", user);

    if(!user.arr){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: SMS QTY validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, { $set : { smsQty : user.arr}}, {}, function (err, smsQty) {
            if(err){
                res.send(err);
            }
            console.log(smsQty);
            res.json(smsQty);
        });
    }
});*/

// PUT USER smsQTY
usersRouter.put('/:id/smsQty', function (req, res, next) {
    var user = req.body;
    console.log("CALL PUT BY: /smsQty - USER");

    if(!user.arr){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: SMS QTY validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, { $set : { smsQty : user.arr}}, {}, function (err, smsQty) {
            if(err){
                res.send(err);
            }
            res.json(smsQty);
        });
    }
});

module.exports = usersRouter;

// New User Ctor fn
function User(user) {
    this.login = user.login;
    this.name = user.name;
    this.nickname = user.nickname;
    this.orgnization = null;
    this.password = user.password;
    this.email = user.email;
    this.registrationDate = new Date();
    this.isAuth = false;
    this.isLogged = false;
    this.admin = false;
    this.lastLogin = null;
    this.smsQty = [];
}

// Occupation Error Ctor Fn
function PropOccupiedError(property) {
    Error.call(this, property);
    this.name = 'PropOccupiedError';
    this.property = property;
    this.message = "ERROR: Such " + property + " already occupied";
    if (Error.captureStackTrace) {
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
    this.message = "ERROR: " + property + " NOT FOUND!";
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, UserNotFoundError);
    } else {
        this.stack = (new Error()).stack;
    }
}
UserNotFoundError.prototype = Object.create(Error.prototype);

// USER VALIDATION FAILED Error Ctor Fn
function NewUserValidationError(property) {
    Error.call(this, property);
    this.name = 'NewUserValidationError';
    this.property = property;
    this.message = "ERROR: NEW USER" + property + " FAILED!";
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, NewUserValidationError);
    } else {
        this.stack = (new Error()).stack;
    }
}
NewUserValidationError.prototype = Object.create(Error.prototype);