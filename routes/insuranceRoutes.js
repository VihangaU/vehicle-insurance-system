const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');

router.get('/packages', insuranceController.getAllInsurancePackages);
router.post('/packages', insuranceController.createInsurancePackage);

module.exports = router;