const User = require('../../models/User');


exports.up = function(knex, Promise) {
    User.db = knex;
    return User.insert({
        username: 'mrmanager',
        first_name: 'Big',
        last_name: 'Steve',
        email: 'bigsteveo@mailinator.com',
    });
};

exports.down = function(knex, Promise) {
    User.db = knex;
    return User.destroy({ username: 'mrmanager' });
};
