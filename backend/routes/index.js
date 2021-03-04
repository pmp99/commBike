const express = require('express');
const router = express.Router();

const userController = require("../controllers/user");
const bikeController = require("../controllers/bike");
const rentalController = require("../controllers/rental");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.put('/user/edit/:userId', userController.edit);
router.put('/user/password/:userId', userController.changePassword);

router.post('/bike/newBikes', bikeController.newBikes);
router.get('/bike/getBikes', bikeController.getBikes);
router.get('/bike/getBike/:bikeId', bikeController.getBike);
router.put('/bike/toggleLockBike/:bikeId', bikeController.toggleLockBike);
router.put('/bike/updatePos/:bikeId', bikeController.updatePosition);

router.get('/rental/getRentals', rentalController.getRentals);
router.get('/rental/getRentals/:userId', rentalController.getUserRentals);
router.post('/rental/new', rentalController.newRental);
router.put('/rental/finish/:rentalId', rentalController.finishRental);
router.put('/rental/updateRoute/:rentalId', rentalController.updateRoute);


module.exports = router;