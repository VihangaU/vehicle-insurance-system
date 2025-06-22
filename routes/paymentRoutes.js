const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.get('/by/user/:userId', paymentController.getPaymentByUser);
router.get('/by/claim/:claimId', paymentController.getPaymentByClaim);

module.exports = router; 