const passport = require('passport');
const User = require('../models/User');

passport.serializeUser(function(user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {
	try {
		const user = await User.findById(id);
		delete user.password; // don't expose password field to req.user
		cb(null, user);
	} catch (error) {
		return cb(error);
	}
});

module.exports = passport;