var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/weddings', ['weddings']);
// var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// Routes
router.get('/', function (req, res) {
    res.render('../public/index', { title : 'Wedding_in'});
});

// GET All Projects
router.get('/api', function (req, res, next) {
    db.weddings.find(function (err, projects) {
        if(err){
            res.send(err);
        } else {
            res.json(projects);
            //console.log(projects);
        }
    });
});

// GET Single Project
router.get('/api/:id', function (req, res, next) {
    db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        //console.log(project);
    });
});

// POST Single Project
router.post('/api', function (req, res, next) {
   var newProject = req.body;
   if(!newProject.fianceName || !newProject.fianceeName || !newProject.weddingDate || !newProject.budget.budgetUSD || !newProject.email || !newProject.telephones) {
       res.status(400);
       res.json({
           "error" : "POST ERROR: not all required fields was filled in"
       });
   } else {
       db.weddings.save(newProject, function (err, newProject) {
           if(err){
               res.send(err);
           }
           res.json(newProject);
           //console.log(newProject);
       });
   }
});

// PUT Single Projects
router.put('/api/:id', function (req, res, next) {
    var project = req.body;
    var updatedProject = {};

    console.log("CALL PUT BY: Default");

    if(project.fianceName && project.fianceeName){
        updatedProject.fianceName = project.fianceName;
        updatedProject.fianceeName = project.fianceeName;
        updatedProject.weddingDate = project.weddingDate;
        updatedProject.email = project.email;
        updatedProject.telephones = project.telephones;
        updatedProject.notes = project.notes;
        updatedProject.fianceSideGuests = project.fianceSideGuests;
        updatedProject.fianceeSideGuests = project.fianceeSideGuests;
        updatedProject.useMenuCheck = project.useMenuCheck;
        updatedProject.budget = project.budget;
        updatedProject.restaurant = project.restaurant;
        updatedProject.restaurantMenu = project.restaurantMenu;
        updatedProject.restaurantCakes = project.restaurantCakes;
        updatedProject.restaurantPlus = project.restaurantPlus;
        updatedProject.decor = project.decor;

    }
    if(!updatedProject){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, updatedProject, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project keyURL = /fianceSideGuests
router.put('/api/:id/fianceSideGuests', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /fianceSideGuests");

    if(!project.fianceName && !project.fianceeName){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { fianceSideGuests : project.fianceSideGuests, restaurant : project.restaurant }}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project keyURL = /fianceeSideGuests
router.put('/api/:id/fianceeSideGuests', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /fianceeSideGuests");

    if(!project.fianceName && !project.fianceeName){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { fianceeSideGuests : project.fianceeSideGuests, restaurant : project.restaurant }}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project BUDGET keyURL = /budget
router.put('/api/:id/budget', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /budget");

    if(!project.budget){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: budget validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { budget: project.budget}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project BUDGET keyURL = /budgetNotes
router.put('/api/:id/budgetNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /budgetNotes");

    if(!project.budgetNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: budgetNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { budgetNotes: project.budgetNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});

// PUT Single Project keyURL = /quickView
router.put('/api/:id/quickView', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /quickView");

    if(!project.restaurant){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurant: project.restaurant}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT keyURL = /quickDataSave
router.put('/api/:id/quickDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /quickDataSave");

    if(!project.restaurant.quickData){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: quickDataSave validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurant: project.restaurant}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT keyURL = /useMenuCheckDataSave
router.put('/api/:id/useMenuCheckDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /useMenuCheckDataSave");

    if(!project){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: useMenuCheckDataSave validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { useMenuCheck: project.useMenuCheck}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT keyURL = /guestsNotes
router.put('/api/:id/guestsNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /guestsNotes");

    if(!project.guestsNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: guestsNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { guestsNotes: project.guestsNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT keyURL = /generalDataSave
router.put('/api/:id/generalDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /generalDataSave");

    if(!project.restaurant.generalData){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: generalDataSave validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurant: project.restaurant}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT PLUS keyURL = /restaurantMenuDataSave
router.put('/api/:id/restaurantMenuDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantMenuDataSave");

    if(!project.restaurantMenu.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurantMenu: project.restaurantMenu}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT PLUS keyURL = /restaurantCakesDataSave
router.put('/api/:id/restaurantCakesDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantCakesDataSave");

    if(!project.restaurantCakes.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurantCakes: project.restaurantCakes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project RESTAURANT PLUS keyURL = /restaurantPlusNewExpItemSave
router.put('/api/:id/restaurantPlusNewExpItemSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /restaurantPlusNewExpItemSave");

    if(!project.restaurantPlus.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: New Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restaurantPlus: project.restaurantPlus}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// PUT Single Project DECOR keyURL = /decorDataSave
router.put('/api/:id/decorDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /decorDataSave");

    if(!project.decor.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: DECOR Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { decor: project.decor}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});

// DELETE Single Project
router.delete('/api/:id', function (req, res, next) {
    console.log("CALL DELETE BY: _id");
    db.weddings.remove({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        //console.log(project);
    });
});

module.exports = router;