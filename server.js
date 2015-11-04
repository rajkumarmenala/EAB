// set up ======================================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Get all routes reference 
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
// end set up ===============================================================


// configuration ===============================================================
var server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));
// end configuration ===============================================================

// routes ======================================================================
server.use('/', routes);
server.use('/users', users);
server.use('/login', login);

// catch 404 and forward to error handler
server.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// end routes ======================================================================


// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
    server.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
server.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;