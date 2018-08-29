const path          = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), 'config/config.env')});

const repl = require('repl');
const db = require('../db/database'); // db connection using Knex.js
const models = require('../models');
const fs = require('fs-extra'); // node filesystem library promisified
const request = require('request-promise-native'); // request library that uses ES6 Promises
const bcrypt = require('bcrypt');
const Password = require('../auth/Password');

const { User } = models;

const _ = require('lodash');
// const stdlib = require( '@stdlib' ); // Which libraries to add from this package ?
const uuid = require('uuid/v4');
const moment = require('moment'); // time format and parsing
const marked = require('marked'); // markdown parser / compiler

async function progger(promise) {
	const result = await promise;
	console.dir(result, { depth: null });
}


// db connection is ready:
db.raw('select 1+1 as result').then(function () {
	// open the REPL session
	const replServer = repl.start({
		prompt: `blog~api (${process.env.NODE_ENV || 'dev'}) > `,
		useColors: true,
	});

	// attach modules to the repl context:
	let context = replServer.context;
	const plugins = {progger, db, models, User, Password, fs, request, bcrypt, _, uuid, moment, marked};

	Object.assign(context, plugins); // attach plugin modules to the REPL context

});
// db('posts').select().then(posts => console.log(posts) );
// https://nodejs.org/docs/latest/api/repl.html#repl_replserver_definecommand_keyword_cmd