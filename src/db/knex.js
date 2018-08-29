// Instantiate the knex client, add custom methods, return client:
module.exports = function(config) {
	const Knex       		= require('knex');
	const KnexQueryBuilder	= require('knex/lib/query/builder');
	const knex = Knex(config); // Initialize knex client.

	// Add custom methods to the query builder
	KnexQueryBuilder.prototype.mapToModel = function(modelConstructor){
		if(modelConstructor) return this.map((row) => new modelConstructor(row));
		else return this;
	};

	// Add pagination support to knex query builder. Adapted from:
	// https://gist.github.com/andremsantos/33781f39444efddbf619514104c55f7d
	KnexQueryBuilder.prototype.paginate = function (pageSize, page) {
		const pagination = {};
		const per_page = pageSize || 10;
		let page_number = page || 1;
		if (page_number < 1) page_number = 1;
		const offset = (page_number - 1) * per_page;
		return Promise.all([
			this.clone().count('id as count').groupBy('id').first(),
			this.offset(offset).limit(per_page)
		])
			.then(([total, rows]) => {
				const count = total.count;
				pagination.total = count;
				pagination.pageSize = per_page;
				pagination.offset = offset;
				pagination.to = offset + rows.length;
				pagination.last_page = Math.ceil(count / per_page);
				pagination.page = page_number;
				pagination.from = offset;
				pagination.data = rows;
				return pagination;
			});
	};

	knex.queryBuilder = function(){
		return new KnexQueryBuilder(knex.client);
	};
	return knex;
};