var express = require('express');
var router = express.Router();
var User = require('../../models/MongoDB/user');

module.exports = function (passport) {
    router.post('/api/account/register', function (req, res, done) {
        //        var registerUser = new User({
        //            username: req.body.Email,
        //            password: req.body.Password,
        //            email: req.body.Email
        //        });
        //        req.param('username') = req.body.Email;
        //        req.param('password') = req.body.Password;
        //        req.param('email') = req.body.Email;
        passport._strategies.signup._verify(req, req.body.username, req.body.password, done);


        //        passport.authenticate('signup', req, req.body.Email, req.body.Password, done, function () {
        //
        //        });

        passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/regsiter',
            failureFlash: true
        });
    });


    // Authenticate a user.
    router.post(
        '/api/account/login ',
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
    return router;
};