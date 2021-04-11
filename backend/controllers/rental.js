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
                        let route = [[bike.long, bike.lat]]
                        route = JSON.stringify(route)
                        const rental = models.rental.build({
                            start,
                            route,
                            userId,
                            bikeId
                        });
                        rental.save({fields: ["start", "route", "userId", "bikeId"]})
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
    const rentalId = req.params.rentalId;
    models.rental.findByPk(rentalId)
        .then(rental => {
            models.bike.findByPk(rental.bikeId)
                .then(bike => {
                    bike.inUse = false
                    bike.save({fields: ["inUse"]})
                        .then(() => {
                            const end = Date.now()
                            rental.end = end
                            // PRECIO: 1€ + 0,25€/min
                            let price = 1 + 0.25 * (end - rental.start) / 60000
                            rental.price = parseFloat(price.toFixed(2))
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

exports.getUserRentals = (req, res, next) => {
    const id = req.params.userId;
    models.rental.findAll({where: {userId: id}, include: {all: true}})
        .then(rentals => {
            res.send(rentals)
        })
        .catch(error => next(error));
};

exports.updateRoute = (req, res, next) => {
    const id = req.params.rentalId;
    const route = req.body.route;
    models.rental.findByPk(id)
        .then(rental => {
            rental.end = Date.now()
            rental.route = JSON.stringify(route)
            rental.save({fields: ["end", "route"]})
                .then((rental) => {
                    res.send(rental)
                })
        })
        .catch(error => next(error));
};

exports.checkActiveRental = (req, res, next) => {
    const id = req.params.userId;
    models.rental.findOne({where: {userId: id, price: null}, include: {all: true}})
        .then(rental => {
            res.send(rental)
        })
        .catch(error => next(error));
};