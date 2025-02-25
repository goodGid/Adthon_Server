/*
 Default module
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});


app.use((req, res, next) => {
  res.r = (result) => {
    res.json({
      status: true,
      message: "success",
      result,
    });
  };
  next();
});

/*
 Custom module
*/
const routes = require('./routes/routes');
const jwt = require('./config/secretKey');

/*
 app.set
*/
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.set('jwt-secret', jwt.secret);

/*
 app.use
*/
app.use(helmet());
app.use(logger('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public_data')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);


// error handler
require('./ErrorHandler')(app);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.path = req.path;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  // console.log("res.locals.message error : " + res.locals.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log("res.locals.error error : " + res.locals.error);

  res.status(err.status || 500);
  res.render('error', { errLog: res.locals.error });
});

module.exports = app;

