module.exports = (sequelize, DataTypes) => {
    const Bike = sequelize.define('bike',
        {
            lat: {
                type: DataTypes.DOUBLE
            },
            long: {
                type: DataTypes.DOUBLE
            },
            locked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            inUse: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            code: {
                type: DataTypes.STRING
            }
        });

    Bike.associate = models => {
        Bike.hasMany(models.rental, {foreingKey: 'bikeId'});
    }

    return Bike;
};