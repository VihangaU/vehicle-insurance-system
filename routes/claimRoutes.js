const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.get('/', claimController.getAllClaims);
router.get('/:id', claimController.getClaimById);
router.post('/', claimController.createClaim);
router.put('/:id', claimController.updateClaim);
router.delete('/:id', claimController.deleteClaim);
router.get('/by/user/:userId', claimController.getClaimByUser);
router.get('/by/vehicle/:vehicleId', claimController.getClaimByVehicle);

module.exports = router; 