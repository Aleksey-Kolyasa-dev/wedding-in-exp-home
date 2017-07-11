// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

//var models = require('./db/models');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// View engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes
app.use('/', require('./routes/index'));
app.use('/projects', require('./routes/index'));

app.use(express.static(path.join(__dirname, './public')));
app.use(cors());

// Server
app.set('port', (process.env.PORT || 5000));
app.listen(process.env.PORT || 5000);
console.log('App is running on port 5000');





module.exports = app;
