const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/vehicles/:userId', vehicleController.getVehicleByUser);
router.post('/vehicles', vehicleController.addVehicle);

module.exports = router;