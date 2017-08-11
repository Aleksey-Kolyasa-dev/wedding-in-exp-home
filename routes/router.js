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
        updatedProject.flower = project.flower;
        updatedProject.leader = project.leader;

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
// PUT Single Project RESTAURANT keyURL = /restNotes
router.put('/api/:id/restNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /restNotes");

    if(!project.restNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: restNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { restNotes: project.restNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
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
// PUT Single Project RESTAURANT keyURL = /menuNotes
router.put('/api/:id/menuNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /menuNotes");

    if(!project.menuNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: menuNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { menuNotes: project.menuNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /cakesNotes
router.put('/api/:id/cakesNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /cakesNotes");

    if(!project.cakesNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: cakesNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { cakesNotes: project.cakesNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project RESTAURANT keyURL = /plusNotes
router.put('/api/:id/plusNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /plusNotes");

    if(!project.plusNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: plusNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { plusNotes: project.plusNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project DECOR keyURL = /decorNotes
router.put('/api/:id/decorNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /decorNotes");

    if(!project.decorNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: decorNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { decorNotes: project.decorNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project FLOWER keyURL = /flowerNotes
router.put('/api/:id/flowerNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /flowerNotes");

    if(!project.decorNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: flowerNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { flowerNotes: project.flowerNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project LEADER keyURL = /leaderNotes
router.put('/api/:id/leaderNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /leaderNotes");

    if(!project.leaderNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: leaderNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { leaderNotes: project.leaderNotes}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project MUSIC keyURL = /musicNotes
router.put('/api/:id/musicNotes', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /musicNotes");

    if(!project.musicNotes){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: musicNotes validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { musicNotes: project.musicNotes}}, {}, function (err, project) {
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
// PUT Single Project FLOWER keyURL = /flowerDataSave
router.put('/api/:id/flowerDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /flowerDataSave");

    if(!project.flower.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: FLOWER Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { flower: project.flower}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            //console.log(project);
            res.json(project);
        });
    }
});
// PUT Single Project LEADER keyURL = /leaderDataSave
router.put('/api/:id/leaderDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /leaderDataSave");

    if(!project.leader.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: LEADER Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { leader: project.leader}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});
// PUT Single Project MUSIC keyURL = /musicDataSave
router.put('/api/:id/musicDataSave', function (req, res, next) {
    var project = req.body;
    console.log("CALL PUT BY: /musicDataSave");

    if(!project.music.expCollection){
        res.status(400);
        res.json({
            "error" : "PUT ERROR: MUSIC Expense Item validation failed"
        });
    } else {
        db.weddings.update({_id: mongojs.ObjectId(req.params.id)}, { $set : { music: project.music}}, {}, function (err, project) {
            if(err){
                res.send(err);
            }
            res.json(project);
        });
    }
});







module.exports = router;