/* eslint-disable no-unused-vars */
// This file loads database package requirements and configurations,
// connects to the database, and exports the connection for use elsewhere
// in the application

// Load the knex configuration specified by the environment variables
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}
const knexConfig = require('../../config/knexfile')[process.env.NODE_ENV];
const knex = require('./knex')(knexConfig);

console.log(`Connected to ${process.env.NODE_ENV} database ` +
	`'${knexConfig.connection.database}'.`);

global.db = knex;
module.exports = knex;
