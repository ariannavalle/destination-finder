require('dotenv').config();
const path = require('path');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Set up the database
require('./configs/db.config');

// bind req.user to view - locals
const bindUserToViewLocals = require('./configs/user-locals.config');

// Routers
const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');
const filterRouter = require('./routes/filter.routes');
const postRouter = require('./routes/post.routes');
const detailsRouter = require('./routes/details.routes');
const mailRouter = require('./routes/mail.routes');
const userRouter = require('./routes/user.routes');

const app = express();

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

// sessions setup
require('./configs/session.config')(app);

// passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./configs/passport.config");

// set local.user to req.user
app.use(bindUserToViewLocals);

// Routes middleware
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', filterRouter);
app.use('/city', detailsRouter);
app.use('/post', postRouter);
app.use('/', mailRouter);
app.use('/', userRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
