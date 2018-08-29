/* eslint-disable no-mixed-spaces-and-tabs */
// const db = require('../db/database');

module.exports = (function() {
	// Re-usable queries for inside the Model class definition:
	const defaultOptions = (pagination={}, mapResults=true) => ({ pagination, mapResults });

	// Generic callback for use with knex.modify. It passes the knex object (db)
	// into the callback function (cb) so you can chain extra knex queries inside callback.
	const callback = (db, cb) => {
		if(cb) return cb(db);
		else return db;
	};

	const paginate = (db, pagination) => {
		const {page, pageSize, order='asc'} = pagination;
		if(page && pageSize) {
			const offset = (page - 1)*pageSize;
			return db.orderBy('id', order).offset(offset).limit(pageSize);
		}
		else return db;
	};

	const mapping = (query, that, mapResults) => {
		const self = that;
		if(mapResults) {
			return query.map((row) => new self(row));
		} else return query;
	};

	let Model = class Model {
		constructor(data) {
			let self = this;
			Object.entries(data).forEach(([key, value]) => self[key] = value);
		}

		static get tableName() {
		    return this._tableName;
		}

		static set tableName(table) {
			this._tableName = table;
		}

		static get db() {
			return this._tableName;
		}

		static set db(database) {
			this._db = database;
		}


		// Make a raw SQL query
		static sql(sqlStatements, valueArray) {
			return this._db.raw(sqlStatements, valueArray);
		}

		// Knex query by the model's tableName
		static q(cb, options={pagination:{}, mapResults:false}) {
			const self = this;
			const { pagination, mapResults } = Object.assign({}, {pagination: {}, mapResults: false}, options);
			const query = this._db.modify(callback, cb).modify(paginate, pagination);
			return query.then((results) => mapping(results, self, mapResults));
		}

		static all(cb, options={pagination:{}, mapResults:true}) {
			const self = this;
			const { pagination, mapResults } = Object.assign({}, defaultOptions(), options);
			const query = this._db(self.tableName).select('*').modify(callback, cb).modify(paginate, pagination);
			return query; //.then((results) => mapping(results, self, mapResults));
		}

		static first() {
			const self = this;
		    return this._db(self.tableName).first('*').then((row) => new self(row));
		}

		static last() {
			const self = this;
			return this._db(self.tableName).select('*').orderBy('id', 'desc').limit(1).then((row) => new self(row[0]));
		}

		// Find one record by its id value.
		static findById(id) {
			const self = this;
			return this._db(self.tableName).select('*').where('id', id).limit(1)
				.map((row) => new self(row))
				.then((instances) => instances[0]);
		}

		// Find records by matching a fieldName by value.
		static find(fieldName, value) {
			const self = this;
			return this._db(self.tableName).select('*').where(fieldName, value)
				.map((row) => new self(row))
				.then((instances) => instances);
		}

		// Find records by matching a fieldName by values.
		static findByValues(fieldName, values) {
			const self = this;
			return this._db(self.tableName).select('*').whereIn(fieldName, values)
				.map((row) => new self(row))
				.then((instances) => instances);
		}

		static insert(data) {
			const self = this;
			return this._db(self.tableName).insert(data, '*').map((row) => new self(row));
		}

		static destroy(where) {
			const self = this;
			return this._db(self.tableName).where(where).del();
		}
	};

	Model._tableName = '';
	Model.db = global.db;

	return Model;
})();


