const { handleRequest, Error } = require('./helpers');

exports.api = function(api, Post) {
	api.get('/v1/posts/summaries', handleRequest(async (req) => {
		const posts = await Post.allSummaries();
		if (!posts || !posts.length) {
			throw Error(404, `No Post summaries found.`);
		}
		return posts;
	}));

	api.get('/v1/posts/summaries/:category', handleRequest(async (req) => {
		const { category } = req.params;
		const posts = await Post.allSummariesByCategory(category);
		if (!posts || !posts.length) {
			throw Error(404, `No Posts with category ${category} found.`);
		}
		return posts;
	}));

	api.get('/v1/posts/:id', handleRequest(async (req) => {
		const { id } = req.params;
		const post = await Post.getById(id);
		if (!post) {
			throw Error(404, `Post with id ${id} not found.`);
		}
		return post;
	}));

	api.get('/v1/posts/:id/body', handleRequest(async (req) => {
		const { id } = req.params;
		const post = await Post.getById(id, true);
		if (!post) {
			throw Error(404, `Post body with id ${id} not found.`);
		}
		return post;
	}));

	// TODO: Turn on after enabling local auth - NL
	// api.post('/v1/posts', handleRequest(async (req) => {
	// 	return Post.insert(req.body);
	// }));

	return api;
};
