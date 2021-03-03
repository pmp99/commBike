const Sequelize = require("sequelize");
const db = require('../models');
const user = db['user']
const bike = db['bike']
const rental = db['rental']
const models = {user: user, bike: bike, rental: rental}

exports.register = (req, res, next) => {
    const {name, email, password, password2} = req.body;
    if (password !== password2) {
        res.send({success: false, data: "Las contraseñas no coinciden"});
        return;
    }
    models.user.findOne({where: {email: email}})
        .then(user => {
            if (user !== null) {
                res.send({success: false, data: "El correo electrónico ya está en uso"});
            } else {
                const user = models.user.build({
                    name,
                    email,
                    password
                });
                user.save({fields: ["name", "email", "password", "salt"]})
                    .then(user => {
                        res.send({success: true, data: user})
                    })
                    .catch(error => next(error));
            }
        })
}


const authenticate = (email, password) => {
    return models.user.findOne({where: {email: email}})
        .then(user => {
            if (user && user.verifyPassword(password)) {
                return user;
            } else {
                return null;
            }
        });
};


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    authenticate(email, password)
        .then(user => {
            if (user != null) {
                res.send(user)
            } else {
                res.send(false)
            }
        })
        .catch(error => next(error));
};

exports.edit = (req, res, next) => {
    const id = req.params.userId;
    const {name, email} = req.body;
    models.user.findByPk(id)
        .then(user => {
            user.name = name;
            user.email = email;
            user.save({fields: ["name", "email"]})
                .then(user => {
                    res.send(user)
                })
        })
        .catch(error => next(error));
}

const authenticatePassword = (id, password) => {
    return models.user.findByPk(id)
        .then(user => {
            if (user && user.verifyPassword(password)) {
                return user;
            } else {
                return null;
            }
        });
};

exports.changePassword = (req, res, next) => {
    const id = req.params.userId;
    const {oldPassword, newPassword, newPassword2} = req.body;
    authenticatePassword(id, oldPassword)
        .then(user => {
            if (user != null) {
                if (newPassword === newPassword2) {
                    user.password = newPassword;
                    user.save({fields: ["password", "salt"]})
                        .then(user => {
                            res.send({success: true, data: user})
                        })
                } else {
                    res.send({success: false, data: "Las contraseñas no coinciden"})
                }
            } else {
                res.send({success: false, data: "Contraseña incorrecta"})
            }
        })
        .catch(error => next(error));
}