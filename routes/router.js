var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// Routes
router.get('/', function (req, res) {
    res.render('../public/index', { title : 'Wedding_in'});
});


// Get All Projects
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

// Get Single Project
router.get('/projects/:id', function (req, res, next) {
    db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        console.log(project);
    });
});

// Post Single Project
router.post('/projects', function (req, res, next) {
    db.weddings.findOne({_id: mongojs.ObjectId(req.params.id)},function (err, project) {
        if(err){
            res.send(err);
        }
        res.json(project);
        console.log(project);
    });
});

module.exports = router;