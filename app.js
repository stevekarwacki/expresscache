var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var responseHelper = require('./helpers/response');

var app = express();
var interceptRender = responseHelper.interceptRender;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'eta');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(interceptRender());

var routePath = './routes/';
var indexRoute = require(routePath + 'index');

// dynamically generate routes
fs.readdirSync(routePath).forEach(function (fileName) {
  var ext = path.extname(fileName);
  if (ext) {
    var file = path.basename(fileName,ext);
    var route = routePath + fileName;
    var dynamicRoute = require(route);
    app.use('/' + file, dynamicRoute);
  }
});

app.use('/', indexRoute);

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
