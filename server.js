// set up ======================================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var flash = require('connect-flash');

// Get all routes reference 
var index_routes = require('./routes/index');
var account_routes = require('./routes/account')
var auth_routes = require('./routes/api/auth')

// end set up ===============================================================

// configuration ============================================================
var server = express();
var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

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

server.use(session({
    secret: process.env.EXPRESS_SECRET,
    key: 'sid',
    cookie: {
        secure: false
    },
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

// end configuration ===========================================================

// routes ======================================================================

// Specify the routes here.
server.use('/', account_routes);
server.use('/', index_routes);
server.use('/', auth_routes);



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