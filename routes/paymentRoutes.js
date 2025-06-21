const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.get('/by/policy/:policyId', paymentController.getPaymentByPolicy);
router.get('/by/user/:userId', paymentController.getPaymentByUser);

module.exports = router; 