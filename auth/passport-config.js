// exporting a function we can use to configure passport
module.exports = function(){
  var passport = require('passport');
  var passportLocal = require('passport-local');
  var userService = require('../services/user-service');

  passport.use( new passportLocal.Strategy({usernameField: 'email'}, function(email, password, next){ //calling authenticate in a route, will cause it to look for a field called 'username' by default, which it will pass to this function as the first parameter(email -right now).  This will go to the "Orders" route
    userService.findUser(email, function(err, user){
      if (err) {
        return next(err); //return next with err.
      }
      if (!user || user.password !== password) {
        return next(null, null) //return next with no error, BUT, also no user
      }
      next(null, user); //return NO error, and a validate user.s
    });
  }));
  //Serializing and deserializing the user to, and from, the Session
  passport.serializeUser(function(user, next){
    next(null, user.email);  // passes a serialized version of the user to the callback.
  });
  passport.deserializeUser(function(email, next){ // retrieves the user by looking up the email
    userService.findUser(email, function(err, user){
      next(err, user);
    });
  });
};

