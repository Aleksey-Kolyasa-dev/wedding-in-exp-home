"use strict";
var express = require('express');
var projectsRouter = express.Router();
var mongojs = require('mongojs');
var db = require('../db/db');
//var db = mongojs('mongodb://localhost:27017/weddings', ['weddings']);
//var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);
var projectsDB = db()._projectsDB_URL;

/*
 * PROJECTS CONTROL ROUTER
 * */

// GET init
projectsRouter.get('/', function (req, res) {
    res.render('../public/index', {title: 'Wedding_in'});
});


/*** PROJECT *START* */
//* GET User Projects
projectsRouter.post('/getProjects', function (req, res) {
    var owner = req.body;
    var projectsCollection = [];

    projectsDB.weddings.find({}, {}, function (err, projects) {
        if (err) {
            console.log("CALL POST PROJECT BY: /getProjects - get ERR", err);
            res.send(err);
        } else {
            projects.forEach(function (project) {
                if (project.owner == owner.id) {
                    projectsCollection.push(project);
                }
            });
            console.log("CALL POST PROJECT BY: /getProjects - get OK");
            res.json(projectsCollection);
        }
    });

});
//* GET Single Project
projectsRouter.get('/api/:id', function (req, res) {
    projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
        if (err) {
            console.log("CALL GET PROJECT BY: _id - get ERR", err);
            res.send(err);
        }
        console.log("CALL GET PROJECT BY: _id - get OK");
        res.json(project);
    });
});
//* GET Single Project by  ACCESS KEY
projectsRouter.post('/AccessKey', function (req, res) {
    var access = req.body;
    var accessProject = {};

    projectsDB.weddings.find({}, {}, function (err, projects) {
        if (err) {
            console.log("CALL POST PROJECT BY: /AccessKey - get ERR", err);
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
                console.log("CALL POST PROJECT BY: /AccessKey - NOT FOUND ERR");
                res.send(new Error('NOT FOUND'));
            } else {
                console.log("CALL POST PROJECT BY: /AccessKey - access OK");
                res.json(accessProject);
            }
        }
    });
});
//* POST New Project
projectsRouter.post('/api', function (req, res) {
    var newProject = req.body;

    if (!newProject.owner || !newProject.fianceName || !newProject.fianceeName || !newProject.weddingDate || !newProject.wedBudget || !newProject.email || !newProject.telephones) {
        console.log("CALL POST PROJECT BY: validation ERR");
        res.status(400);
        res.json({
            "error": "POST ERROR: not all required fields was filled in"
        });
    } else {

        projectsDB.weddings.save(new NewProjectCtor(newProject), function (err, newProject) {
            if (err) {
                console.log("CALL POST PROJECT BY: NEW PROJECT - post ERR");
                res.send(err);
            } else {
                console.log("CALL POST PROJECT BY: NEW PROJECT - post OK");
                res.json(newProject);
            }
        });
    }
});
//* PUT Single Projects
projectsRouter.put('/api/:id', function (req, res) {
    var request = req.body;

    if (!request.fianceName && !request.fianceeName && !request.owner && !request.weddingDate && !request.wedBudget && !request.email) {
        console.log("CALL PUT PROJECT BY: PROJECT INIT DATA - validation ERR");
        res.status(400);
        res.json({
            "error": "PUT ERROR: validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {
                $set: {
                    fianceName: request.fianceName,
                    fianceeName: request.fianceeName,
                    weddingDate: request.weddingDate,
                    wedBudget: request.wedBudget,
                    email: request.email,
                    telephones: request.telephones,
                    notes: request.notes
                }
            }, {},
            function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT BY: PROJECT INIT DATA - update ERR");
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT BY: PROJECT INIT DATA  - update OK");
                    res.json(project);
                }
            });
    }
});
//* DELETE Single Project
projectsRouter.delete('/api/:id', function (req, res) {

    projectsDB.weddings.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
        if (err) {
            console.log("CALL DELETE PROJECT BY: _id - delete ERR", err);
            res.send(err);
        } else {
            console.log("CALL DELETE PROJECT BY: _id - delete OK");
            res.json(project);
        }
    });
});
/*** PROJECT *END* */


/*** GENERAL *START* */
//* PUT Single Project keyURL = /fianceSideGuests
projectsRouter.put('/api/:id/fianceSideGuests', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data.join) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {fianceSideGuests: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project keyURL = /fianceeSideGuests
projectsRouter.put('/api/:id/fianceeSideGuests', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data.join) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {fianceeSideGuests: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project BUDGET keyURL = /budget
projectsRouter.put('/api/:id/budgetDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject){
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {budget: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project BUDGET keyURL = /tasksDataSave
projectsRouter.put('/api/:id/tasksDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {tasks: request[request.key]}}, {}, function (err, project) {
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
/*** GENERAL *END* */


/*** NOTES *START* */
//* PUT Single Project BUDGET keyURL = /projectNotes
projectsRouter.put('/api/:id/projectNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {notes: request.data}}, {}, function (err, response) {
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
//* PUT Single Project BUDGET keyURL = /budgetNotes
projectsRouter.put('/api/:id/budgetNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.budget ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {budgetNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.budget BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
//* PUT Single Project RESTAURANT keyURL = /restNotes
projectsRouter.put('/api/:id/restNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
//* PUT Single Project RESTAURANT keyURL = /guestsNotes
projectsRouter.put('/api/:id/guestsNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {guestsNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
//* PUT Single Project RESTAURANT keyURL = /menuNotes
projectsRouter.put('/api/:id/menuNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {menuNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
//* PUT Single Project RESTAURANT keyURL = /cakesNotes
projectsRouter.put('/api/:id/cakesNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {cakesNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
        });
    }
});
//* PUT Single Project RESTAURANT keyURL = /plusNotes
projectsRouter.put('/api/:id/plusNotes', function (req, res) {
    var request = req.body;

    if (request.data === false) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {plusNotes: request.data}}, {}, function (err, response) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(response);
            }
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
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {decorNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project FLOWER keyURL = /flowerNotes
projectsRouter.put('/api/:id/flowerNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {flowerNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project LEADER keyURL = /leaderNotes
projectsRouter.put('/api/:id/leaderNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {leaderNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project MUSIC keyURL = /musicNotes
projectsRouter.put('/api/:id/musicNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {musicNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project ANIMATOR keyURL = /animatorNotes
projectsRouter.put('/api/:id/animatorNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {animatorNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project SHOW keyURL = /showNotes
projectsRouter.put('/api/:id/showNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {showNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project PHOTO keyURL = /photoNotes
projectsRouter.put('/api/:id/photoNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {photoNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project VIDEO keyURL = /videoNotes
projectsRouter.put('/api/:id/videoNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {videoNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project REGISTRATION keyURL = /registrationNotes
projectsRouter.put('/api/:id/registrationNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {registrationNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project MARRIAGE keyURL = /marriageNotes
projectsRouter.put('/api/:id/marriageNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {marriageNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project TRANSPORT keyURL = /transportNotes
projectsRouter.put('/api/:id/transportNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {transportNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project DRESS_M keyURL = /dressMNotes
projectsRouter.put('/api/:id/dressMNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {dressMNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project DRESS_W keyURL = /dressWNotes
projectsRouter.put('/api/:id/dressWNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {dressWNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project PARTY_M keyURL = /partyMNotes
projectsRouter.put('/api/:id/partyMNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {partyMNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project PARTY_W keyURL = /dressWNotes
projectsRouter.put('/api/:id/partyWNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {partyWNotes: request[request.key]}}, {}, function (err, response) {
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
//* PUT Single Project OTHER keyURL = /otherNotes
projectsRouter.put('/api/:id/otherNotes', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {otherNotes: request[request.key]}}, {}, function (err, response) {
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
/*** NOTES *END* */


/*** DATA *START* */
//* PUT Single Project RESTAURANT MENU CHECK keyURL = /useMenuCheckDataSave
projectsRouter.put('/api/:id/useMenuCheckDataSave', function (req, res) {
    var request = req.body;

    if (typeof request[request.key] != "boolean") {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {useMenuCheck: request[request.key]}}, {}, function (err, project) {
            if (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR");
                res.send(err);
            } else {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                res.json(project);
            }
        });
    }
});
//* PUT Single Project RESTAURANT QUICK keyURL = /quickDataSave
projectsRouter.put('/api/:id/quickDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project.restaurant[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurant: project.restaurant}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
                console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
            });
    }
});
//* PUT Single Project RESTAURANT GENERAL keyURL = /generalDataSave
projectsRouter.put('/api/:id/generalDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project.restaurant = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurant: project.restaurant}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project RESTAURANT MENU keyURL = /restaurantMenuDataSave
projectsRouter.put('/api/:id/restaurantMenuDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantMenu: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project RESTAURANT CAKES keyURL = /restaurantCakesDataSave
projectsRouter.put('/api/:id/restaurantCakesDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantCakes: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project RESTAURANT PLUS keyURL = /restaurantPlusNewExpItemSave
projectsRouter.put('/api/:id/restaurantPlusDataSave', function (req, res) {
    var request = req.body;

    if (!request.key || !request.data) {
        res.status(400);
        console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT.restaurant ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        var promise = new Promise(function (resolve, reject) {
            projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - get ERR", err);
                    res.send(err);
                    reject(err);
                } else {
                    resolve(project);
                }
            });
        });

        promise.then(function (project) {
            project[request.key] = request.data;

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {restaurantPlus: project[request.key]}}, {}, function (err, project) {
                if (err) {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });

        }).catch(function (err) {
            console.log("CALL PUT PROJECT.restaurant BY: " + request.keyURL + " - update ERR:", err);
        });
    }
});
//* PUT Single Project DECOR keyURL = /decorDataSave
projectsRouter.put('/api/:id/decorDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {decor: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project FLOWER keyURL = /flowerDataSave
projectsRouter.put('/api/:id/flowerDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {flower: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project LEADER keyURL = /leaderDataSave
projectsRouter.put('/api/:id/leaderDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {leader: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project MUSIC keyURL = /musicDataSave
projectsRouter.put('/api/:id/musicDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {music: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project ANIMATOR keyURL = /animatorDataSave
projectsRouter.put('/api/:id/animatorDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {animator: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project SHOW keyURL = /showDataSave
projectsRouter.put('/api/:id/showDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {show: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project PHOTO keyURL = /photoDataSave
projectsRouter.put('/api/:id/photoDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {photo: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project VIDEO keyURL = /videoDataSave
projectsRouter.put('/api/:id/videoDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {video: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project REGISTRATION keyURL = /registrationDataSave
projectsRouter.put('/api/:id/registrationDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {registration: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project MARRIAGE keyURL = /marriageDataSave
projectsRouter.put('/api/:id/marriageDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {marriage: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project TRANSPORT keyURL = /transportDataSave
projectsRouter.put('/api/:id/transportDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {transport: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project DRESS_M keyURL = /dressMDataSave
projectsRouter.put('/api/:id/dressMDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {dressM: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project DRESS_W keyURL = /dressWDataSave
projectsRouter.put('/api/:id/dressWDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {dressW: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project PARTY_M keyURL = /partyMDataSave
projectsRouter.put('/api/:id/partyMDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {partyM: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project PARTY_W keyURL = /partyWDataSave
projectsRouter.put('/api/:id/partyWDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {partyW: request[request.key]}}, {}, function (err, project) {
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
//* PUT Single Project OTHER keyURL = /otherDataSave
projectsRouter.put('/api/:id/otherDataSave', function (req, res) {
    var request = req.body;

    if (request[request.key] === false) {
        res.status(400);
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.json({
            "error": "PUT PROJECT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {other: request[request.key]}}, {}, function (err, project) {
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
/*** DATA *END* */


/*** SMS *START* */
//* PUT PROJECT SMS (clear list) keyURL = /sms
projectsRouter.put('/api/:id/sms', function (req, res) {
    var request = req.body;

    if (!request.data || !request.data.join) {
        console.log("CALL PUT PROJECT BY: " + request.keyURL + " - validation ERR");
        res.status(400);
        res.json({
            "error": "PUT ERROR: " + request.keyURL + " validation failed"
        });
    } else {
        projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {smsCollection: request.data}}, {}, function (err, sms) {
            if (err) {
                console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update ERR");
                res.send(err);
            }
            console.log("CALL PUT PROJECT BY: " + request.keyURL + " - update OK");
            res.json(sms);
        });
    }
});
//* POST VISITOR SMS
projectsRouter.post('/api/:id/visitorNewSMS', function (req, res) {
    var request = req.body;

    if(!request.data){
        console.log("CALL POST PROJECT BY: " + request.keyURL + " - validation ERR");
        res.status(400);
        res.json({
            "error": "CALL POST PROJECT BY: " + request.keyURL + " - validation ERR"
        });
    }
    var promise = new Promise(function (resolve, reject) {
        projectsDB.weddings.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, project) {
            if (err) {
                console.log("CALL POST PROJECT BY: " + request.keyURL + " - get ERR", err);
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
            arr.push(request.data);

            projectsDB.weddings.update({_id: mongojs.ObjectId(req.params.id)}, {$set: {smsCollection: arr}}, {}, function (err, project) {
                if (err){
                    console.log("CALL POST PROJECT BY: " + request.keyURL + " - update ERR", err);
                    res.send(err);
                } else {
                    console.log("CALL POST PROJECT BY: " + request.keyURL + " - update OK");
                    res.end();
                }
            });
        } else {
            res.send(new Error('NOT AN ARRAY'));
            throw new Error('NOT AN ARRAY');
        }

    }).catch(function (err) {
        console.log("ERROR: POST" + request.keyURL + " FAILED", err);
    });
});
/*** SMS *END* */


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
    this.smsCollection = [];
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
    this.animatorNotes = null;
    this.showNotes = null;
    this.photoNotes = null;
    this.videoNotes = null;
    this.registrationNotes = null;
    this.marriageNotes = null;
    this.transportNotes = null;
    this.dressMNotes = null;
    this.dressWNotes = null;
    this.partyMNotes = null;
    this.partyWNotes = null;
    this.otherNotes = null;


    //INTERMEDIATE DATA
    this.useMenuCheck = false;

    // MENU DATA
    this.budget = {
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
    this.tasks = {
        expCollection:[]
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
        expCollection:[],
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
        expCollection:[],
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

    this.arrangement = {
        total: {
            planUsd: 0,
            planNat: 0,

            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.decor = {
        expCollection:[],
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
        expCollection:[],
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

    this.program = {
        total: {
            planUsd: 0,
            planNat: 0,

            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.leader = {
        expCollection:[],
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
        expCollection:[],
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
    this.animator = {
        expCollection:[],
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
    this.show = {
        expCollection:[],
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

    this.filming = {
        total: {
            planUsd: 0,
            planNat: 0,

            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.photo = {
        expCollection:[],
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
        expCollection:[],
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

    this.registration = {
        expCollection:[],
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
    this.marriage = {
        expCollection:[],
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
        expCollection:[],
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

    this.dress = {
        total: {
            planUsd: 0,
            planNat: 0,

            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.dressM = {
        expCollection:[],
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
        expCollection:[],
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

    this.party = {
        total: {
            planUsd: 0,
            planNat: 0,

            paidTotalUsd: 0,
            paidTotalNat: 0,
            restTotalUsd: 0,
            restTotalNat: 0
        }
    };
    this.partyM = {
        expCollection:[],
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
    this.partyW = {
        expCollection:[],
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
        expCollection:[],
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