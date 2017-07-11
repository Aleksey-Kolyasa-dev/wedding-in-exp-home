var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://alex:4444@ds149132.mlab.com:49132/alkol_db', ['weddings']);

// Routes
router.get('/', function (req, res) {
    res.render('../public/index', { title : 'Wedding_in'});
});


// Routes
router.get('/projects', function (req, res) {
    db.weddings.find(function (err, weddings) {
        if(err){
            res.send(err);
        }
        res.json(weddings);
        console.log(weddings);
    });

});

module.exports = router;