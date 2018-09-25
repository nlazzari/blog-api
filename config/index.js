const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), 'config/config.env')});
module.exports = {
	knex: {
		development: {
			client: 'pg',
			connection: {
				port:     process.env.DB_PORT_DEVELOPMENT,
				host:     process.env.DB_HOST_DEVELOPMENT,
				database: process.env.DB_NAME_DEVELOPMENT,
				user:     process.env.DB_USER_DEVELOPMENT,
				password: process.env.DB_PASSWORD_DEVELOPMENT
			},
			pool: {
				min: 2,
				max: 10
			},
			migrations: {
				directory: './src/db/migrations',
				tableName: 'knex_migrations',
			}
		},
		production: {
			client: 'pg',
			connection: {
				port:     process.env.DB_PORT_PRODUCTION,
				host:     process.env.DB_HOST_PRODUCTION,
				database: process.env.DB_NAME_PRODUCTION,
				user:     process.env.DB_USER_PRODUCTION,
				password: process.env.DB_PASSWORD_PRODUCTION
			},
			pool: {
				min: 2,
				max: 10
			},
			migrations: {
				directory: './src/db/migrations',
				tableName: 'knex_migrations',
			},
		},
	},
	redis: {
		development: {
			host: process.env.REDIS_HOST_DEVELOPMENT,
			port: process.env.REDIS_PORT_DEVELOPMENT,
			ttl: 2592000,
		},
		production: {
			host: process.env.REDIS_HOST_PRODUCTION,
			port: process.env.REDIS_PORT_PRODUCTION,
			ttl: 2592000,
		},
	},
	session: {
		secret: process.env.EXPRESS_SESSION_SECRET,
		resave: false,
		saveUninitialized: true
	},
	cors: {
		optionsAsync(req, callback) {
			let corsOptions;
			const corsWhitelist = [
				`http://${process.env.FRONT_END_PRODUCTION_URL}`,
				`http://www.${process.env.FRONT_END_PRODUCTION_URL}`,
			];
			if (process.env.NODE_ENV === 'production' && whitelist.includes(req.header('Origin'))) {
				corsOptions = { origin: true }; // allow the requested origin in the CORS response
			} else
			if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
				corsOptions = { origin: true };
			} else {
				corsOptions = { origin: false } // disable CORS for this request
			}
			callback(null, corsOptions) // callback expects two parameters: error and options
		}
	},
};