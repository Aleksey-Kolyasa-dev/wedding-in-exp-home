'use strict';

module.exports = function (connection, mongoose, moment) {

    var User = require('./user')(modelHelpers, connection, mongoose);

    return {
        user: User
    };
};
