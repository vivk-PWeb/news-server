const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { checkUser } = require('./middleware/auth');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');
const commentRoute = require('./routes/comment');

const mongoose = require('mongoose');

const mongodbUrl = 'mongodb://localhost:27017/serverNews';
const mongodbConnect = mongoose.connect(mongodbUrl);

mongodbConnect
	.then(db => {
		console.log(`Connected correctly to DB by URL=${mongodbUrl}`);
	}, err => {
		console.log(err);
	});

const app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', checkUser);
app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/news', newsRouter);
app.use('/comment', commentRoute);

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
