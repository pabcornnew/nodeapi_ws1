var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var indexRouter = require('./routes/index');

var routeauth = './routes/api/';

var usersRouter = require(routeauth + 'users');
var loginRouter = require(routeauth + 'login');
var productRouter = require(routeauth + 'products');
var orderRouter = require(routeauth + 'orders');

var app = express();
var cors = require('cors');

// verify token
const verifyToken = require('./middleware/jwt_decode');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./db');
app.use('/', indexRouter);
app.use('/api/v1' ,loginRouter);

app.use('/users', usersRouter);

app.use('/api/v1', verifyToken, productRouter);
app.use('/api/v1', verifyToken, orderRouter);


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
