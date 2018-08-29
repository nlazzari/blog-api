const Model = require('./Model');

class Category extends Model {
	constructor(data) {
		super(data);
	}
}
Category.tableName = 'categories';

module.exports = Category;