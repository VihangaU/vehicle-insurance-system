const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.get('/', policyController.getAllPolicies);
router.get('/:id', policyController.getPolicyById);
router.post('/', policyController.createPolicy);
router.put('/:id', policyController.updatePolicy);
router.delete('/:id', policyController.deletePolicy);
router.get('/by/user/:userId', policyController.getPolicyByUser);
router.get('/by/vehicle/:vehicleId', policyController.getPolicyByVehicle);

module.exports = router; 