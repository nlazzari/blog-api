const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Password = require('./Password');

exports.Strategy = function (passport) {
	const options = {
		session: true,
	};

	passport.use(new LocalStrategy(options,
		async function(username, password, cb) {
			try {
				const user = await User.findByUsername(username);
				const passwordIsEqual = await Password.isEqual(password, user.password);

				if (!user) {
					return cb(null, false);
				}
				if (!passwordIsEqual) {
					return cb(null, false);
				}

				return cb(null, user);

			} catch (error) {
				return cb(error);
			}
		}));
};