const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/:userId', vehicleController.getVehicleByUser);
router.post('/', vehicleController.addVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;