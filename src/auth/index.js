const passport = require('./passport');
const Local = require('./local');
const Password = require('./Password');

Local.Strategy(passport); // use LocalStrategy with Passport

module.exports =  {
	passport,
	Password,
};

