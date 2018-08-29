const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

class Password {
	// Auto-generates a salt used to create a securely hashed password. Returns a combined salt + hash
	static hash(plaintextPassword) {
		return bcrypt.hash(plaintextPassword, SALT_ROUNDS);
	}

	// Compares a plaintext password with a hashed password (ie. one stored in a database)
	static isEqual(plaintextPassword, hashedPassword) {
		return bcrypt.compare(plaintextPassword, hashedPassword);
	}

}

module.exports = Password;