const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pollsRouter = require('./routes/polls');
const gapsRouter = require('./routes/gaps');
const assignationsRouter = require('./routes/assignations');
const cors = require('cors')
const secureRandom = require('secure-random');
nJwt = require('njwt');

const app = express();
app.use(cors());

secretKey = secureRandom(256, {
  type: 'Buffer'
}); // Create a highly random byte array of 256 bytes


const mysql = require("mysql");
//Database connection
app.use(function (req, res, next) {
  res.locals.connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'areufree'
  });
  res.locals.connection.connect();
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/polls', pollsRouter);
app.use('/api/v1/gaps', gapsRouter);
app.use('/api/v1/assignations', assignationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;