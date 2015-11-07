var express = require('express');
var router = express.Router();


// Render the home page.
router.get('/', function (req, res) {
    if (!req.user || req.user.status !== 'ENABLED') {
        return res.redirect('/login');
    }

    res.render('index', {
        title: 'Home',
        user: req.user
    });
});



module.exports = router;