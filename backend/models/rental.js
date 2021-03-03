module.exports = (sequelize, DataTypes) => {
    const Rental =  sequelize.define('rental',
        {
            start: {
                type: DataTypes.INTEGER
            },
            end: {
                type: DataTypes.INTEGER
            },
            price: {
                type: DataTypes.DOUBLE
            }
        });

    Rental.associate = models => {
        Rental.belongsTo(models.user, {as: 'user', foreingKey: 'userId'});
        Rental.belongsTo(models.bike, {as: 'bike', foreingKey: 'bikeId'});
    }

    return Rental;
};