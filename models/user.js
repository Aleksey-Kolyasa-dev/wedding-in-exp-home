'use strict';

module.exports = function (connection, mongoose) {

    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        login: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        lastLogin: {
            type: Date,
            required: true
        },
        registrationDate: {
            type: Date,
            required: true
        },
        isAuth: {
            type: Boolean,
            required: true
        },
        isLogged:  {
            type: Boolean,
            required: true
        },
        isAdmin:  {
            type: Boolean,
            required: true
        },
        organization: {
            type: String,
            required: true
        },
        smsQty: {
            type: Array,
            required: true
        }
    });

    userSchema.methods.toString = function () {
        return this.name;
    };

    userSchema.statics.generateNew = function (login, password, email, name, nickname) {
        return new User({
            login: login,
            password: password,
            name : name,
            email: email,
            nickname : nickname,
            lastLogin : moment().utc(),
            registrationDate: moment().utc(),
            isAuth: false,
            isLogged: false,
            isAdmin: false,
            organization: '',
            smsQty: []
        });
    };

    var User = connection.model('User', userSchema);

    return User;
};
