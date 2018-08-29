const Model = require('./Model');

class User extends Model {
	constructor(data) {
		super(data);
	}

	static async findByUsername(username) {
		const users = await super.find('username', username);
		return users && users[0];
	}

}
User.tableName = 'users';

module.exports = User;
