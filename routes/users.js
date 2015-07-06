var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config');
var userService = require('../services/user-service');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Mounted with a base URL of /users

/* GET users listing. */
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create an account'
  };
  res.render('users/create', vm); //view model
});
/* POST users listing. */
router.post('/create', function(req, res, next) {

  userService.addUser(req.body, function(err) {

  if (err) {
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err
      };

      delete vm.input.password;
      return res.render('users/create', vm);
    }
    req.login(req.body, function(err){
        res.redirect('/orders');
    });
  });
});

router.post('/login',
  function(req, res, next) {
    req.session.orderId = 12345;
    if (req.body.rememberMe) {
        req.session.cookie.maxAge = config.cookieMaxAge;
      }
    next(); // it would get stuck here if we didn't call next() here.
  },
  passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/orders',
    failureFlash: 'Invalid Credentials'
}));

router.get('/logout', function(req, res, next){
  req.logout(); // to clear the login session and remove the req.user property
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;
