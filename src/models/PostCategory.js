const Model = require('./Model');

class PostCategory extends Model {
	constructor(data) {
		super(data);
	}
}
PostCategory.tableName = 'post_category';

module.exports = PostCategory;