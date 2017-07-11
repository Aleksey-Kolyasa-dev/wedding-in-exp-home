var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// Routes
router.get('/', function (req, res) {
    res.render('../public/index', { title : 'Wedding_in'});
});


// GET All Projects
router.get('/projects', function (req, res, next) {
    db.weddings.find(function (err, projects) {
        if(err){
            res.send(err);
        } else {
            res.json(projects);
            console.log(projects);
        }
    });
});

// GET Single Project
router.get('/projects/:id', function (req, res, next) {
    db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        console.log(project);
    });
});

// POST Single Project
router.post('/projects', function (req, res, next) {
   var newProject = req.body;
   if(!newProject.fianceName || !newProject.fianceeName || !newProject.weddingDate || !newProject.wedBudget || !newProject.email || !newProject.telephone) {
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
           console.log(newProject);
       });
   }
});
// PUT Single Project
router.put('/projects/:id', function (req, res, next) {
    var project = req.body;
    var updatedProject = {};

    if(project.fianceName && project.fianceeName){
        updatedProject.fianceName = project.fianceName;
        updatedProject.fianceeName = project.fianceeName;
        updatedProject.weddingDate = project.weddingDate;
        updatedProject.wedBudget = project.wedBudget;
        updatedProject.email = project.email;
        updatedProject.telephone = project.telephone;
        updatedProject.notes = project.notes;
        updatedProject.fianceSideGuests = project.fianceSideGuests;
        updatedProject.fianceeSideGuests = project.fianceeSideGuests;
        console.log(updatedProject);
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
            console.log(project);
            res.json(project);

        });
    }
});


// DELETE Single Project
router.delete('/projects/:id', function (req, res, next) {
    db.weddings.remove({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        console.log(project);
    });
});

module.exports = router;