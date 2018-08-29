const Post = require('../../models/Post');
const seedPosts = require('../seed/starter-posts.json');


exports.up = function (knex, Promise) {
    Post.db = knex;
    return Post.insert(seedPosts);
};

exports.down = function (knex, Promise) {
    Post.db = knex;
    return Promise.all(seedPosts.map((post) => {
        return Post.destroy({ title: post.title });
    }));
};
