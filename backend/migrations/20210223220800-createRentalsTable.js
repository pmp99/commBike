'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('rentals',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    unique: true
                },
                start: {
                    type: Sequelize.INTEGER
                },
                end: {
                    type: Sequelize.INTEGER
                },
                price: {
                    type: Sequelize.DOUBLE
                },
                route: {
                    type: Sequelize.TEXT
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('rentals');
    }
};