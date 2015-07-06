var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');

var config = require('./config');
var routes = require('./routes/index');
var users = require('./routes/users');
var orders = require('./routes/orders');

var MongoStore = connectMongo(expressSession); //pass in the express session middleware

var passportConfig = require('./auth/passport-config');
var restrict = require('./auth/restrict');
passportConfig(); // execute what was loaded

mongoose.connect(config.mongoUri);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(
  {
    secret: 'getting hungry', //used to sign a cookie to prevent tappering
    saveUninitialized: false, //whether or not we want to create a session if nothing is stored in it
    resave: false, // whether we want to resave a session that hasn't been modified
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }
));
app.use(flash());
app.use(passport.initialize()); //before the routes, to authenticate, BEFORE we give the routes
app.use(passport.session()); // validates a session

app.use('/', routes);
app.use('/users', users);
app.use(restrict); // restrict access to all order routes
app.use('/orders', orders);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
