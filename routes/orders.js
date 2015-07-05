var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var vm = {
    title: 'Place an order',
    firstName: req.user ? req.user.firstName : null
  }
  console.log(vm);
  res.render('orders/index', vm);

});

module.exports = router;
