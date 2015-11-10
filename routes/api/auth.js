var express = require('express');
var router = express.Router();

//app.post('/auth', passport.authenticate('local'), function(req, res){
//  console.log("passport user", req.user);
//})

module.exports = function (passport) {
    router.post('/api/account/register', function (req, res) {
        passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/register',
            failureFlash: true
        });
    });


    // Authenticate a user.
    router.post(
        '/api/account/login',
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
    return router;
};