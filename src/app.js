/* eslint-disable quotes,no-unused-vars */
const path          = require('path');
const dotenv 		= require('dotenv').config({path: path.resolve(process.cwd(), 'config/config.env')});
const config		= require('../config');
const express       = require('express');
const db            = require('./db/database');
const { passport }	= require('./auth');
const session 		= require('express-session');
const RedisStore 	= require('connect-redis')(session);
const Redis 		= require('ioredis');
const redisClient 	= new Redis(config.redis[process.env.NODE_ENV || 'development']);
// const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cors			= require('cors');


const api = require('./api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(Object.assign(config.session, { store: new RedisStore({ client: redisClient })})));
app.use(cors(config.cors.optionsAsync));

app.use(passport.initialize());
app.use(passport.session()); // Initialize Passport and restore authentication state, if any, from the session.

app.use(express.static(path.join(__dirname, '../pub'))); // static assets (img, fonts, files, etc)
app.use(express.static(path.join(__dirname, '../upload'))); // public upload folder

app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
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
