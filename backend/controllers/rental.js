const Sequelize = require("sequelize");
const db = require('../models');
const user = db['user']
const bike = db['bike']
const rental = db['rental']
const models = {user: user, bike: bike, rental: rental}

exports.newRental = (req, res, next) => {
    const {userId, code} = req.body;
    models.bike.findOne({where: {code: code}})
        .then(bike => {
            if (bike !== null) {
                if (bike.inUse || bike.locked) {
                    res.send('ERROR')
                    return;
                }
                bike.inUse = true
                bike.save({fields: ["inUse"]})
                    .then((bike) => {
                        const bikeId = bike.id
                        const start = Date.now()
                        const rental = models.rental.build({
                            start,
                            userId,
                            bikeId
                        });
                        rental.save({fields: ["start", "userId", "bikeId"]})
                            .then(rental => {
                                res.send(rental)
                            })
                            .catch(error => next(error))
                    })
                    .catch(error => next(error))
            } else {
                res.send(false)
            }
        })
        .catch(error => next(error))
};

exports.finishRental = (req, res, next) => {
    const rentalId = req.body.rentalId;
    models.rental.findByPk(rentalId)
        .then(rental => {
            models.bike.findByPk(rental.bikeId)
                .then(bike => {
                    bike.inUse = false
                    bike.save({fields: ["inUse"]})
                        .then(() => {
                            const end = Date.now()
                            rental.end = end
                            rental.price = 1 + Math.round(100 * 0.25 * (end - rental.start) / 60000) / 100
                            rental.save({fields: ["end", "price"]})
                                .then((rental) => {
                                    res.send(rental)
                                })
                        })
                })
        })
};

exports.getRentals = (req, res, next) => {
    models.rental.findAll({include: {all: true}})
        .then(rentals => {
            res.send(rentals)
        })
        .catch(error => next(error));
};