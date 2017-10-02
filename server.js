// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// View engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes
app.use('/', require('./routes/projects'));
app.use('/api', require('./routes/projects'));
app.use('/users', require('./routes/users'));
// Static folder
app.use(express.static(path.join(__dirname, './public')));

// Cross Origin Access Control
app.use(cors());

// Server
var port = 443;
app.set('port', (process.env.PORT || port));
app.listen(process.env.PORT || port, function () {
    console.log('App is running on port ' + port);
});

module.exports = app;
