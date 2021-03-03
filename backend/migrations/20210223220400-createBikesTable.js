'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('bikes',
            {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    unique: true
                },
                lat: {
                    type: Sequelize.DOUBLE
                },
                long: {
                    type: Sequelize.DOUBLE
                },
                locked: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                inUse: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                code: {
                    type: Sequelize.STRING
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
        return queryInterface.dropTable('bikes');
    }
};