const { Category, PostCategory } = require('../../models');
const seedCategories = require('../seed/starter-categories');
const seedPostCategories = require('../seed/starter-post-category');


exports.up = async function (knex, Promise) {
    Category.db = knex;
    PostCategory.db = knex;
    await Category.insert(seedCategories);
    await PostCategory.insert(seedPostCategories);
    return Promise.resolve();
};

exports.down = async function (knex, Promise) {
    Category.db = knex;
    PostCategory.db = knex;

    await Promise.all(seedPostCategories.map((pc) => {
        return PostCategory.destroy({
            post_id: pc.post_id,
            category_id: pc.category_id,
        });
    }));

    await Promise.all(seedCategories.map((category) => {
        return Category.destroy({ id: category.id });
    }));
    
    return Promise.resolve();
};
