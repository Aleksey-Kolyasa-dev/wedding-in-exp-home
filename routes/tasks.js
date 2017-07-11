/*
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017', ['weddings']);

// Routes
router.get('/tasks', function (req, res) {
    db.weddings.find(function (err, weddings) {
        if(err){
           res.send(err);
        }
        res.json(weddings);
    });
});

module.exports = router;*/
