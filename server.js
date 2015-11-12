// set up ======================================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var dbConfig = require('./db.js');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

// end set up ===============================================================
var server = express();
// configuration ============================================================
// Configuring Passport
server.use(expressSession({
    secret: 'mySecretKey'
}));

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));


server.use(passport.initialize());
server.use(passport.session());
server.use(flash());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
// Get all routes reference 
var index_routes = require('./routes/index');
var account_routes = require('./routes/account');
var auth_routes = require('./routes/api/auth')(passport);


// end configuration ===========================================================

// routes ======================================================================

// Specify the routes here.
server.use('/', account_routes);
server.use('/', index_routes);
server.use('/', auth_routes);


// catch 404 and forward to error handler
server.use(function (req, res, next) {
    console.log(err);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// end routes ======================================================================

// will print stacktrace

if (server.get('env') === 'development') {

    server.use(function (err, req, res, next) {
        //console.log(res);
        console.log(err.message);
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