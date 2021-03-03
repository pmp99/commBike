'use strict';
const crypt = require('../helpers/crypt');

module.exports = {
    up(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('users', [
            {
                name: 'Pablo',
                password: crypt.encryptPassword('1234', 'admin'),
                email: 'admin@gmail.com',
                salt: 'admin',
                isAdmin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
};