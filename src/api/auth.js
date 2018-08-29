/* eslint-disable quotes */
exports.api = function(api, passport) {
	api.post('/v1/login', (req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err) { return res.status(500).json('error'); }
			if (!user) { return res.status(404).json('User not found'); }
			if (user) {
				req.logIn(user, (err) => {
					if (err) { res.status(500).json('error'); }
					const { user: { id, username } } = req;
					return res.status(200).json({
						message: `You're logged in!`,
						user: { id: id, username: username }
					});
				});
			}
		})(req, res, next);
	});

	api.get('/v1/logout', (req, res) => {
		req.logout();
		res.status(200).json(`You're logged out!`);
	});

	return api;
};


