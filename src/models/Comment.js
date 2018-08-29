const Model = require('./Model');

class Comment extends Model {
	constructor(data) {
		super(data);
	}

}
Comment.tableName = 'comments';

module.exports = Comment;