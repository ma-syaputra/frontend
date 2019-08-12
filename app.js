var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const bp = require("body-parser").json({limit: '1mb'})
var app = express();
const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient();
const redisStore = require('connect-redis')(session);
// app.use(session({
//   secret: process.env.SESSION_KEY,
//   name: process.env.SESSION_STORAGE,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true},
//   store: new redisStore({ host: 'localhost', port: 6379, pass:"", client: redisClient, ttl: 86400 }),
// }));

app.use(session({
  secret: process.env.SESSION_KEY,
  // create new redis store.
  store: new redisStore({ host: 'localhost', port: 6379,pass:"", client: redisClient,ttl : 86400}),
  saveUninitialized: false,
  resave: false
}));

app.use(bp)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/jquery', express.static(__dirname + '/assets/jquery')); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
