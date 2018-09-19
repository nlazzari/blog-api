const Model = require('./Model');
const slug = require('slug');

const POST_SUMMARY_COLUMNS = ['title', 'subtitle', 'image', 'slug', 'author', 'categories', 'created_at'];
const POST_COLUMNS = ['title', 'subtitle', 'body', 'image', 'slug', 'author', 'categories', 'created_at'];

class Post extends Model {
	constructor(data) {
		super(data);
	}

	static selectColumns(columns) {
		const knex = this._db;
		let selects = knex.select('p.id AS id');
		const isWildcardOrIncludes = (colName) => (columns === '*' || columns.includes(colName));

		if (isWildcardOrIncludes('title')) {
			selects = selects.select('p.title AS title');	
		}
		if (isWildcardOrIncludes('subtitle')) {
			selects = selects.select('p.subtitle AS subtitle');
		}
		if (isWildcardOrIncludes('body')) {
			selects = selects.select('p.body AS body');
		}
		if (isWildcardOrIncludes('image')) {
			selects = selects.select('p.image AS image');
		}
		if (isWildcardOrIncludes('slug')) {
			selects = selects.select('p.slug AS slug');
		}
		if (isWildcardOrIncludes('published')) {
			selects = selects.select('p.published AS published');
		}
		if (isWildcardOrIncludes('deleted')) {
			selects = selects.select('p.deleted AS deleted');
		}
		if (isWildcardOrIncludes('categories')) {
			selects = selects.select(knex.raw(
				`( SELECT COALESCE(json_agg(cats.category), json_build_array()) FROM (
					SELECT cat.category FROM categories cat
					LEFT OUTER JOIN post_category AS postcat ON cat.id = postcat.category_id
					LEFT OUTER JOIN posts pst ON pst.id = postcat.post_id
					WHERE pst.id = p.id	
				) AS cats) AS "categories"`));
		}
		if (isWildcardOrIncludes('author')) {
			selects = selects.select(knex.raw(
				`json_build_object(
					'id', u.id,
					'first_name', u.first_name,
					'last_name', u.last_name,
					'username', u.username
				) AS author`));
		}
		if (isWildcardOrIncludes('created_at')) {
			selects = selects.select('p.created_at AS created_at');
		}
		if (isWildcardOrIncludes('updated_at')) {
			selects = selects.select('p.updated_at AS updated_at');
		}

		return selects;
	}

	static addTablestoQuery(query) {
		const knex = this._db;
		return query
			.from(knex.raw(`posts p`))
			.joinRaw('LEFT OUTER JOIN users AS u ON p.author_id = u.id')
			.joinRaw('LEFT OUTER JOIN post_category AS pc ON p.id = pc.post_id')
			.joinRaw('LEFT OUTER JOIN categories AS c ON c.id = pc.category_id');
	}

	static allSummaries(orderBy = 'desc') {
		const knex = this._db;
		const self = this;
		return Post.addTablestoQuery(
			Post.selectColumns(POST_SUMMARY_COLUMNS))
			.where({
				published: true,
				deleted: false,
			})
			.orderBy('created_at', orderBy)
			.orderBy('id', orderBy)
			.groupByRaw('p.id')
			.groupByRaw('u.id')
			.map((row) => new self(row));
	}

	static allSummariesByCategory(category, orderBy = 'desc') {
		const knex = this._db;
		const self = this;
		return Post.addTablestoQuery(
			Post.selectColumns(POST_SUMMARY_COLUMNS))
			.where({
				published: true,
				deleted: false,
				'c.category': category,
			})
			.orderBy('created_at', orderBy)
			.orderBy('id', orderBy)
			.groupByRaw('p.id')
			.groupByRaw('u.id')
			.map((row) => new self(row));
	}

	static all(cols) {
		const self = this;
		const columns = cols ? cols : '*';
		return this._db(self.tableName).select(columns).orderBy('id', 'asc').map((post) => (new self(post)));
	}

	static async getById(id, onlyFetchBody = false) {
		const knex = this._db;
		const self = this;
		const columns = onlyFetchBody ? ['body'] : POST_COLUMNS;
		const result = await Post.addTablestoQuery(Post.selectColumns(columns))
			.where({ 'p.id': id })
			.map((row) => new self(row));
			if (result && result.length) {
				return result[0];
			} else {
				return null;
			}
	}

	static insert(posts) {
		const self = this;

		const postsWithSlug = posts.map((post) => {
			const postSlug = post.slug ? post.slug : slug(post.title.toLowerCase());
			return { ...post, slug: postSlug };
		});

		return this._db(self.tableName).insert(postsWithSlug, '*').map((row) => new self(row));
	}

}
Post.tableName = 'posts';

module.exports = Post;