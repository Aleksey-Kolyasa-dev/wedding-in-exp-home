var express = require('express');
var usersRouter = express.Router();
var mongojs = require('mongojs');
var db = require('../db/db');
//var moment = require('moment');
//var usersDB = mongojs('mongodb://localhost:27017/wedUsers', ['wedUsers']);
//var usersDB = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['wedUsers']);
var usersDB = db()._usersDB_URL;

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
            if (!newUser.login || !newUser.password || !newUser.email) {
                reject(new NewUserValidationError('VALIDATION'));
            } else {
                // Do save New Registred User in DB (if no rejects)
                usersDB[collection].save(new User(newUser), function (err, registredUser) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log('CALL POST BY: NEW USER: ' + newUser.name + ' REGISTRED');
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

                    if (user.login == 'xardaz') {
                        user.isAdmin = true;
                    } else {
                        user.isAdmin = false;
                    }

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
                            isAuth: user.isAuth,
                            isAdmin: user.isAdmin
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

    if (!user._id) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: LOGOUT validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, {
            $set: {
                isLogged: user.isLogged,
                isAuth: user.isAuth
            }
        }, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});

// PUT USER ONLINE STATUS
usersRouter.put('/:id/uOnline', function (req, res, next) {
    var request = req.body;

    if (!request.moment) {
        res.status(400);
        res.end();
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, {$set: {moment: request.moment}}, {}, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                //console.log(request.name + ' ONLINE');
                res.end();
            }
        });
    }
});
// GET USER PING STATUS
usersRouter.get('/:id/uPing', function (req, res, next) {
    //console.log('ping');
    res.end();
});

//* PUT USER smsQTY
usersRouter.put('/:id/smsQty', function (req, res, next) {
    var request = req.body;

    if (!request.arr) {
        console.log("CALL PUT USER BY: /smsQty - validation ERR");
        res.status(400);
        res.json({
            "error": "PUT ERROR: SMS QTY validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, {$set: {smsQty: request.arr}}, {}, function (err, smsQty) {
            if (err) {
                console.log("CALL PUT USER BY: /smsQty - update ERR", err);
                res.send(err);
            }
            console.log("CALL PUT USER BY: /smsQty - update OK");
            res.json(smsQty);
        });
    }
});
//* PUT USER SERVER MSG
usersRouter.put('/:id/svrMsgChecked', function (req, res, next) {
    var request = req.body;

    if (!request.data.join) {
        console.log("CALL PUT USER BY: /svrMsgChecked - validation ERR");
        res.status(400);
        res.json({
            "error": "PUT ERROR: SERVER MGS validation failed"
        });
    } else {
        usersDB[collection].update({_id: mongojs.ObjectId(req.params.id)}, {$set: {serverMSG: request.data}}, {}, function (err, smsQty) {
            if (err) {
                console.log("CALL PUT USER BY: /svrMsgChecked - update ERR", err);
                res.send(err);
            }
            console.log("CALL PUT USER BY: /svrMsgChecked - update OK");
            res.json(smsQty);
        });
    }
});


/*ADMIN*/
// POST ANNOUNCEMENT NOTE
usersRouter.post('/admin/announcement', function (req, res) {
    var request = req.body;

    var promise = new Promise(function (resolve, reject) {
        // Get all users in DB
        usersDB[collection].find({}, {}, function (e, users) {
            console.log('CALL ADMIN POST BY: /announcement');
            users.forEach(function (user) {
                if (!user.serverMSG) {
                    user.serverMSG = [];
                }
                user.serverMSG.push(request.data);


                // Do current Promise chain resolved
                resolve(user);

                // Do USER LOGIN STATUS update to DB
                usersDB[collection].update({_id: mongojs.ObjectId(user._id)}, {
                    $set: {
                        serverMSG: user.serverMSG
                    }
                }, {}, function (err, data) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            // If no coincides, do  REJECT - USER NOT FOUND!
            reject(new UserNotFoundError('USER'));
        });
    });

    promise.then(
        function (success) {
            // If all ok (no rejects)
            console.log('CALL ADMIN POST BY: /announcement - Ok');
            res.send("done");
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
// POST PATCH NOTE
usersRouter.post('/admin/patchNotes', function (req, res) {
    var request = req.body;

    var promise = new Promise(function (resolve, reject) {
        // Get all users in DB
        usersDB[collection].find({}, {}, function (e, users) {
            console.log('CALL ADMIN POST BY: /patchNotes');
            users.forEach(function (user) {
                if (!user.serverMSG) {
                    user.serverMSG = [];
                }
                user.serverMSG.push(request.data);

                // Do current Promise chain resolved
                resolve(user);

                // Do USER LOGIN STATUS update to DB
                usersDB[collection].update({_id: mongojs.ObjectId(user._id)}, {
                    $set: {
                        serverMSG: user.serverMSG
                    }
                }, {}, function (err, data) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            // If no coincides, do  REJECT - USER NOT FOUND!
            reject(new UserNotFoundError('USER'));
        });
    });

    promise.then(
        function (success) {
            // If all ok (no rejects)
            console.log('CALL ADMIN POST BY: /patchNotes - Ok');
            res.send("done");
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
// GET ONLINE
usersRouter.get('/getOnline', function (req, res, next) {
    var count = 0;
    usersDB[collection].find({}, {}, function (e, users) {
        users.forEach(function (user) {
            if(user.isLogged){
                count++;
            }
        });

        res.json(count);
        console.log(count, req.url);
    });

});
// GET uSTATS
usersRouter.get('/admin/uStats', function (req, res, next) {
   var arr = [];
    usersDB[collection].find({}, {}, function (e, users) {
        users.forEach(function (user) {
           arr.push(user);
        });

        res.json(arr);
        //console.log(count, req.url);
    });

});



module.exports = usersRouter;

// New User Ctor fn
function User(user) {
    this.login = user.login;
    this.password = user.password;
    this.name = user.name;
    this.email = user.email;
    this.nickname = user.nickname;
    this.registrationDate = new Date();
    this.lastLogin = null;
    this.isAuth = false;
    this.isLogged = false;
    this.isAdmin = false;
    this.organization = null;
    this.smsQty = [];
    this.serverMSG = [];
    this.sfx = false;
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

// CHECK USERS ONLINE STATUS
var count = 0;
function checkOnline() {
    var start = Date.now();
    usersDB[collection].find({}, {}, function (e, users) {
        users.forEach(function (user) {
            if(user.moment && user.isLogged){
                if(start - user.moment > 360000) {
                    // Do USER LOGIN STATUS update to DB
                    usersDB[collection].update({_id: mongojs.ObjectId(user._id)}, {
                        $set: {
                            isLogged: false
                        }
                    }, {}, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(user.name + ' OFFLINE, ' + count++);

                        }
                    });
                }
            }
        });
    });
}
setInterval(function () {
    checkOnline();
}, 1200000); // 20min 1200000
checkOnline();
//////////////////