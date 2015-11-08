var express = require('express');
var router = express.Router();


// Render the registration page.
router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register',
        error: req.flash('error')[0]
    });
});


// Render the login page.
router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login',
        error: req.flash('error')[0]
    });
});


// Logout the user, then redirect to the home page.
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;