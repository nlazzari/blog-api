
exports.up = function(knex, Promise) {
	return Promise.all([

		knex.schema.createTable('users', table => {
			table.increments('id').primary();
			table.string('username').unique();
			table.string('password');
			table.string('first_name');
			table.string('last_name');
			table.string('email');
			table.boolean('admin').defaultTo(false);
			table.timestamps(false, true);
		}),

		knex.schema.createTable('posts', table => {
			table.increments('id').primary();
			table.string('title');
			table.string('subtitle');
			table.string('image');
			table.string('slug');
			table.text('body');
			table.boolean('published').defaultTo(false);
			table.boolean('deleted').defaultTo(false);
			table.integer('author_id')
				.references('id')
				.inTable('users');
			table.timestamps(false, true);
		}),

		knex.schema.createTable('comments', table => {
			table.increments('id').primary();
			table.text('body');
			table.boolean('hidden').defaultTo(false);
			table.boolean('deleted').defaultTo(false);
			table.integer('author_id')
				.references('id')
				.inTable('users');
			table.integer('post_id')
				.references('id')
				.inTable('posts');
			table.timestamps(false, true);
		}),

		knex.schema.createTable('categories', table => {
			table.increments('id').primary();
			table.text('category').unique();
			table.timestamps(false, true);
		}),

		knex.schema.createTable('post_category', table => {
			table.increments('id').primary();
			table.integer('category_id')
				.references('id')
				.inTable('categories');
			table.integer('post_id')
				.references('id')
				.inTable('posts');
			table.timestamps(false, true);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.raw('DROP TABLE users CASCADE;'),
		knex.raw('DROP TABLE posts CASCADE;'),
		knex.raw('DROP TABLE comments CASCADE;'),
		knex.raw('DROP TABLE categories CASCADE;'),
		knex.raw('DROP TABLE post_category CASCADE;')
	]);
};
