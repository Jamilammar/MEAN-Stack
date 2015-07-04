var express = require('express');
var router = express.Router();
var userService = require('../services/user-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
      console.log(req.body);
      return res.render('users/create', vm);
    }
      console.log(req.body);
  res.redirect('/orders');

  });
});
module.exports = router;
