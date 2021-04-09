const Sequelize = require("sequelize");
const db = require('../models');
const user = db['user']
const bike = db['bike']
const rental = db['rental']
const models = {user: user, bike: bike, rental: rental}

exports.getBikes = (req, res, next) => {
    models.bike.findAll()
        .then(bikes => {
            res.send(bikes)
        })
        .catch(error => next(error));
};

exports.getBike = (req, res, next) => {
    const id = req.params.bikeId;
    models.bike.findByPk(id)
        .then(bike => {
            res.send(bike)
        })
        .catch(error => next(error));
};

const addBike = (pos) => {
    const long = pos[0]
    const lat = pos[1]
    const locked = false
    const inUse = false
    let code = null;
    let bici = null;
    // Nos aseguramos de que la bicicleta creada tenga un código
    // que no esté en uso
    do {
        code = Math.floor(Math.random()*10000).toString()
        models.bike.findOne({where: {code: code}})
            .then(bike => {
                bici = bike
            })
    } while (bici !== null)
    const bike = models.bike.build({
        lat,
        long,
        locked,
        inUse,
        code
    });
    bike.save({fields: ["lat", "long", "locked", "inUse", "code"]})
        .then(() => {
            return true
        })
}

exports.newBikes = async (req, res, next) => {
    const pos = req.body.pos;
    for (let i = 0; i < pos.length; i++) {
        await addBike(pos[i])
    }
    models.bike.findAll()
        .then(bikes => {
            res.send(bikes)
        })
        .catch(error => next(error));
};

exports.toggleLockBike = (req, res, next) => {
    const id = req.params.bikeId;
    models.bike.findByPk(id)
        .then(bike => {
            bike.locked = !bike.locked
            bike.save({fields: ["locked"]})
                .then((bike) => {
                    models.bike.findAll()
                        .then((bikes) => {
                            res.send({bikes: bikes, bike: bike})
                        })
                })
        })
        .catch(error => next(error));
};

exports.updatePosition = (req, res, next) => {
    const id = req.params.bikeId;
    const pos = req.body.pos;
    models.bike.findByPk(id)
        .then(bike => {
            bike.long = pos[0]
            bike.lat = pos[1]
            bike.save({fields: ["lat", "long"]})
                .then((bike) => {
                    res.send(bike)
                })
        })
        .catch(error => next(error));
};