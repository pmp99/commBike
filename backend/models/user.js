const crypt = require('../helpers/crypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "Name must not be empty"}}
        },
        password: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "Password must not be empty"}},
            set(password) {
                // Random String used as salt.
                this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
                this.setDataValue('password', crypt.encryptPassword(password, this.salt));
            }
        },
        email:{
            type: DataTypes.STRING,
            unique: true,
            validate: {notEmpty: {msg: "Email must not be empty"}}
        },
        salt: {
            type: DataTypes.STRING,
            defaultValue: "aaaa"
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    User.prototype.verifyPassword = function (password) {
        return crypt.encryptPassword(password, this.salt) === this.password;
    };

    User.associate = models => {
        User.hasMany(models.rental, {foreingKey: 'userId'});
    }

    return User;
};