exports.api = function(api, Post, User) {
	api.get('/v1/posts/summaries', async (req, res) => {
		const posts = await Post.allSummaries();
		return res.json(posts);
	});

	api.get('/v1/posts/summaries/:category', async (req, res) => {
		const posts = await Post.allSummariesByCategory(req.params.category);
		return res.json(posts);
	});

	api.get('/v1/posts/:id', async (req, res) => {
		const post = await Post.getById(req.params.id);
		return res.json(post);
	});

	api.get('/v1/posts/:id/body', async (req, res) => {
		const post = await Post.getById(req.params.id, true);
		return res.json(post);
	});

	api.post('/v1/posts', async (req, res) => {
		try {
			const results = await Post.insert(req.body);
			return res.json(results);
		} catch(err) {
			res.send(`Error: \n ${err}`);
		}
		
	});

	return api;
};
