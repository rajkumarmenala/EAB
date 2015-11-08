var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');

// Register a new user to Stormpath.
router.post('/api/account/register', function (req, res) {
    console.log(' Inside account register');
    var username = req.body.username;
    var password = req.body.password;

    // Grab user fields.
    if (!username || !password) {
        return res.render('register', {
            title: 'Register',
            error: 'Email and password required.'
        });
    }

    // Initialize our Stormpath client.
    var apiKey = new stormpath.ApiKey(
        process.env['STORMPATH_API_KEY_ID'],
        process.env['STORMPATH_API_KEY_SECRET']
    );
    var spClient = new stormpath.Client({
        apiKey: apiKey
    });

    // Grab our app, then attempt to create this user's account.
    var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function (err, app) {
        if (err) throw err;

        app.createAccount({
            givenName: 'John',
            surname: 'Smith',
            username: username,
            email: username,
            password: password,
        }, function (err, createdAccount) {
            if (err) {
                return res.render('register', {
                    title: 'Register',
                    error: err.userMessage
                });
            } else {
                passport.authenticate('stormpath')(req, res, function () {
                    return res.redirect('/dashboard');
                });
            }
        });
    });

});


// Authenticate a user.
router.post(
    '/api/account/login',
    passport.authenticate(
        'stormpath', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.',
        }
    )
);


module.exports = router;