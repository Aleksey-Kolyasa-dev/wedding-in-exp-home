"use strict";
var express = require('express');
var projectsRouter = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/weddings', ['weddings']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

/*
 * PROJECTS CONTROL ROUTER
 * */
// GET init
projectsRouter.get('/', function (req, res) {
    res.render('../public/index', {title: 'Wedding_in'});
});

// GET User Projects
projectsRouter.post('/getProjects', function (req, res) {
    var owner = req.body;
    var projectsCollection = [];

    db.weddings.find({}, {}, function (err, projects) {
        if (err) {
            res.send(err);
        } else {
            projects.forEach(function (project) {
                if (project.owner == owner.id) {
                    projectsCollection.push(project);
                }
            });
            console.log('CALL POST By: /getProjects');
            res.json(projectsCollection);
        }
    });

});

// GET Single Project
projectsRouter.get('/api/:id', function (req, res) {
    db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
        if (err) {
            res.send(err);
        }
        res.json(project);
        //console.log(project);
    });
});
// GET Single Project by KEY ACCESS
projectsRouter.post('/keyAccess', function (req, res) {
    var access = req.body;
    var accessProject = {};

    db.weddings.find({}, {}, function (err, projects) {
        if (err) {
            res.send(err);
        } else {
            projects.forEach(function (project) {
                if (project.accessKey == access.key) {
                    accessProject = project;
                    delete accessProject.smsCollection;
                    delete accessProject.owner;
                    delete accessProject.notes;
                    delete accessProject.budgetNotes;
                    delete accessProject.restNotes;
                    delete accessProject.guestsNotes;
                    delete accessProject.menuNotes;
                    delete accessProject.cakesNotes;
                    delete accessProject.plusNotes;
                    delete accessProject.decorNotes;
                }
            });
            if (!accessProject.accessKey) {
                res.send(new Error('NOT FOUND'));
            } else {
                console.log('CALL POST By: /AccessKey');
                res.json(accessProject);
            }
        }
    });
});
// POST New Project
projectsRouter.post('/api', function (req, res) {
    var newProject = req.body;

    if (!newProject.owner || !newProject.fianceName || !newProject.fianceeName || !newProject.weddingDate || !newProject.wedBudget || !newProject.email || !newProject.telephones) {
        res.status(400);
        res.json({
            "error": "POST ERROR: not all required fields was filled in"
        });
    } else {

        db.weddings.save(new NewProjectCtor(newProject), function (err, newProject) {
            if (err) {
                res.send(err);
            }
            res.json(newProject);
        });
    }
});
// PUT Single Projects
projectsRouter.put('/api/:id', function (req, res) {
    var project = req.body;

    console.log("CALL PUT BY: PROJECT INIT DATA UPDATE");

    if (!project.fianceName && !project.fianceeName && !project.owner && !project.weddingDate && !project.email) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {
                $set: {
                    fianceName: project.fianceName,
                    fianceeName: project.fianceeName,
                    weddingDate: project.weddingDate,
                    wedBudget: project.wedBudget,
                    email: project.email,
                    telephones: project.telephones,
                    notes: project.notes
                }
            }, {},
            function (err, project) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(project);
                }
            });
    }
});
// DELETE Single Project
projectsRouter.delete('/api/:id', function (req, res) {
    console.log("CALL DELETE BY: _id");
    db.weddings.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
        if (err) {
            res.send(err);
        }
        res.json(project);
        //console.log(project);
    });
});


// PUT Single Project keyURL = /fianceSideGuests
projectsRouter.put('/api/:id/fianceSideGuests', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /fianceSideGuests");

    if (!project.fianceName && !project.fianceeName) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {
            $set: {
                fianceSideGuests: project.fianceSideGuests,
                restaurant: project.restaurant
            }
        }, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project keyURL = /fianceeSideGuests
projectsRouter.put('/api/:id/fianceeSideGuests', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /fianceeSideGuests");

    if (!project.fianceName && !project.fianceeName) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {
            $set: {
                fianceeSideGuests: project.fianceeSideGuests,
                restaurant: project.restaurant
            }
        }, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project BUDGET keyURL = /budget
projectsRouter.put('/api/:id/budget', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /budget");

    if (!project.budget) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: budget validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {budget: project.budget}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});


// PUT Single Project BUDGET keyURL = /projectNotes
projectsRouter.put('/api/:id/projectNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /projectNotes");

    if (!project.notes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: projectNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {notes: project.notes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project BUDGET keyURL = /budgetNotes
projectsRouter.put('/api/:id/budgetNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /budgetNotes");

    if (!project.budgetNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: budgetNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {budgetNotes: project.budgetNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /restNotes
projectsRouter.put('/api/:id/restNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /restNotes");

    if (!project.restNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: restNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restNotes: project.restNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /guestsNotes
projectsRouter.put('/api/:id/guestsNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /guestsNotes");

    if (!project.guestsNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: guestsNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {guestsNotes: project.guestsNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /menuNotes
projectsRouter.put('/api/:id/menuNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /menuNotes");

    if (!project.menuNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: menuNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {menuNotes: project.menuNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /cakesNotes
projectsRouter.put('/api/:id/cakesNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /cakesNotes");

    if (!project.cakesNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: cakesNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {cakesNotes: project.cakesNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /plusNotes
projectsRouter.put('/api/:id/plusNotes', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /plusNotes");

    if (!project.plusNotes) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: plusNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {plusNotes: project.plusNotes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            res.json(project);
        });
    }
});
//** PUT Single Project DECOR keyURL = /decorNotes
projectsRouter.put('/api/:id/decorNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {decorNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
// PUT Single Project FLOWER keyURL = /flowerNotes
projectsRouter.put('/api/:id/flowerNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {flowerNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
// PUT Single Project LEADER keyURL = /leaderNotes
projectsRouter.put('/api/:id/leaderNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {leaderNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
// PUT Single Project MUSIC keyURL = /musicNotes
projectsRouter.put('/api/:id/musicNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {musicNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
// PUT Single Project PHOTO keyURL = /photoNotes
projectsRouter.put('/api/:id/photoNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {photoNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
// PUT Single Project VIDEO keyURL = /videoNotes
projectsRouter.put('/api/:id/videoNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {videoNotes: request[request.key]}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});



// PUT Single Project RESTAURANT keyURL = /quickDataSave
projectsRouter.put('/api/:id/quickDataSave', function (req, res) {
    var request = req.body;

    if (!request[request.key] && !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT BY: " + request.keyURL + " - GET ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project.restaurant.quickData = request.data;

            db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurant: project.restaurant}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR:", err);
            });
    }
});
// PUT Single Project RESTAURANT keyURL = /useMenuCheckDataSave
projectsRouter.put('/api/:id/useMenuCheckDataSave', function (req, res) {
    var request = req.body;

    if (typeof request[request.key] != "boolean") {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {useMenuCheck: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /generalDataSave
projectsRouter.put('/api/:id/generalDataSave', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /generalDataSave");

    if (!project.restaurant.generalData) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: generalDataSave validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurant: project.restaurant}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT PLUS keyURL = /restaurantMenuDataSave
projectsRouter.put('/api/:id/restaurantMenuDataSave', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantMenuDataSave");

    if (!project.restaurantMenu.expCollection) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantMenu: project.restaurantMenu}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT PLUS keyURL = /restaurantCakesDataSave
projectsRouter.put('/api/:id/restaurantCakesDataSave', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantCakesDataSave");

    if (!project.restaurantCakes.expCollection) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantCakes: project.restaurantCakes}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT PLUS keyURL = /restaurantPlusNewExpItemSave
projectsRouter.put('/api/:id/restaurantPlusNewExpItemSave', function (req, res) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantPlusNewExpItemSave");

    if (!project.restaurantPlus.expCollection) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantPlus: project.restaurantPlus}}, {}, function (err, project) {
            if (err) {
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});


//** PUT Single Project DECOR keyURL = /decorDataSave
projectsRouter.put('/api/:id/decorDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {decor: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project FLOWER keyURL = /flowerDataSave
projectsRouter.put('/api/:id/flowerDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {flower: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project LEADER keyURL = /leaderDataSave
projectsRouter.put('/api/:id/leaderDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {leader: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project MUSIC keyURL = /musicDataSave
projectsRouter.put('/api/:id/musicDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {music: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project PHOTO keyURL = /photoDataSave
projectsRouter.put('/api/:id/photoDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {photo: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
// PUT Single Project VIDEO keyURL = /videoDataSave
projectsRouter.put('/api/:id/videoDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {video: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});


// PUT USER SMS (clear list) keyURL = /sms
projectsRouter.put('/api/:id/sms', function (req, res) {
    var request = req.body;
    console.log("CALL PUT BY: /sms");

    if (!request.data) {
        res.status(400);
        res.json({
            "error": "PUT ERROR: SMS validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {smsCollection: request.data}}, {}, function (err, sms) {
            if (err) {
                res.send(err);
            }
            res.json(sms);
        });
    }
});
// POST VISITOR SMS
projectsRouter.post('/api/:id', function (req, res) {
    var visitorMsg = req.body;
    delete visitorMsg._id;


    var promise = new Promise(function (resolve, reject) {
        db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
            if (err) {
                res.send(err);
                reject(err);
            } else {
                resolve(project);
            }
        });
    });

    promise.then(function (project) {
        var arr;
        arr = project.smsCollection;

        if (arr.join) {
            arr.push(visitorMsg);
            db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {smsCollection: arr}}, {}, function (err, project) {
                if (err) {
                    res.send(err);
                }
                console.log('CALL POST by: VISITOR NEW SMS - ok');
                res.end();
            });
        } else {
            res.send(new Error('NOT AN ARRAY'));
            throw new Error('NOT AN ARRAY');
        }

    }).catch(function (err) {
        console.log('ERROR: VISITOR NEW SMS FAILED', err);
    });
});

module.exports = projectsRouter;

// New Project Constructor
function NewProjectCtor(project) {
    // INIT DATA
    this.owner = project.owner;
    this.accessKey = project.accessKey;
    this.created = project.created;
    this.fianceName = project.fianceName;
    this.fianceeName = project.fianceeName;
    this.weddingDate = project.weddingDate;
    this.wedBudget = project.wedBudget;
    this.email = project.email;
    this.telephones = project.telephones;
    this.notes = project.notes;
    this.smsCollection = [
        /*{
         date : null,
         author : null,
         msg : null,
         }*/
    ];
    this.fianceSideGuests = [];
    this.fianceeSideGuests = [];

    //NOTES
    this.budgetNotes = null;
    this.restNotes = null;
    this.guestsNotes = null;
    this.menuNotes = null;
    this.cakesNotes = null;
    this.plusNotes = null;
    this.decorNotes = null;
    this.flowerNotes = null;
    this.leaderNotes = null;
    this.musicNotes = null;
    this.photoNotes = null;
    this.videoNotes = null;
    this.zagsNotes = null;
    this.transportNotes = null;


    //INTERMEDIATE DATA
    this.useMenuCheck = false;

    // MENU DATA
    this.budget = {
        /*budgetUSD: project.wedBudget,*/
        budgetNat: 0,
        nationalMoney: '',
        currency: 1,
        total: {
            // TTL SUM ALL PLANS
            wedPlanTotalNat: 0,
            wedPlanTotalUsd: 0,

            // TTL SUM ALL PAID
            wedPaidTotalNat: 0,
            wedPaidTotalUsd: 0,

            // TTL SUM ALL REST
            wedRestTotalNat: 0,
            wedRestTotalUsd: 0,

            // TOTAL WED BUDGET REST by PLAN
            wedBudgetRestPlanUsd: 0,
            wedBudgetRestPlanNat: 0,

            // TOTAL WED BUDGET REST by FACT
            wedBudgetRestFactUsd: 0,
            wedBudgetRestFactNat: 0
        }
    };
    this.restaurant = {
        name: null,
        address: null,
        telephones: null,
        website: null,
        guestsQty: 2,
        quickView: false,
        quickData: {
            quickGuestsQty: 2,
            quickCheck: 0,
            quickPercent: 0,
            quickPlugs: 0,
            planNat: 0,
            planUsd: 0
        },
        generalData: {
            generalCheck: 0,
            generalPercent: 0,
            generalPlugs: 0,

            sumCheckNat: 0,
            sumPercentNat: 0,
            sumPlugsNat: 0,
            fullCheckNat: 0
        },
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            restUsd: 0,
            restNat: 0,
            planTotalUsd: 0,
            planTotalNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.restaurantMenu = {
        expCollection: [
            /* {
             name : 'ТОРТ', // *<input S
             portionWeight : 0, // *<input N
             portionPrice : 0, // *<input N
             portionQty : 0, // *<input N
             toPay : 0, // portionPrice * portionQty
             totalWeight: 0, // portionWeight * portionQty
             category : null // *<input S
             }*/
        ],
        total: {
            totalMenuPriceNat: 0, // sum[toPai]
            totalMenuWeight: 0, // sum[totalWeight]

            calculatedCheck: 0, // sum[toPay] / guestsQty
            weightPerGuest: 0 // sum[totalWeight] / guestsQty
        },
        categories: [
            "Холодные закуски",
            "Салаты",
            "Горячие закуски",
            "Основные блюда",
            "Дисерт",
            "Напитки А",
            "Напитки Б/А",
            "Фуршет",
            "Инное"
        ]
    };
    this.restaurantCakes = {
        expCollection: [
            /*{
             name : 'ТОРТ', // *<input S
             grPerGuest : 0, // *<input N
             totalKg : 0, // guestsQ * grPerGuest
             kgPrice : 0, // *<input N
             toPai : 0, // totalKg * kgPrice
             paid : 0, // *<input N
             rest : 0, // toPai - paid
             usd : false,
             money : null
             }*/
        ],
        total: {
            planUsd: 0, // planNat / currency
            planNat: 0, // sum[toPai]
            paidUsd: 0, // paidNat / currency
            paidNat: 0, // sum[paid]
            paidTotalUsd: 0, //
            paidTotalNat: 0, //
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.restaurantPlus = {
        expCollection: [],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.decor = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.flower = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.leader = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.music = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.photo = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.video = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.zags = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.transport = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.other = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.dressM = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.dressW = {
        expCollection: [/*{
         name : 'ТОРТ',
         tariff : 200,
         multiplier : 5,
         unit : 'kg',
         toPai : 0,
         paid : 0,
         rest : 0,
         usd : false,
         money : null
         }*/],
        total: {
            planUsd: 0,
            planNat: 0,
            paidUsd: 0,
            paidNat: 0,
            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
}