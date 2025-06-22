const Payment = require('../models/Payment');
const Policy = require('../models/Policy');
const User = require('../models/User');
const Claim = require('../models/Claim');

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        if (payments.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { policyId, userId, claimId, amount, paymentDate, method, status } = req.body;
        const mongoose = require('mongoose');
        // Validate ObjectIds
        if (!policyId || !userId || !claimId) {
            return res.status(400).json({ message: 'policyId, userId, and claimId are required' });
        }
        if (!mongoose.Types.ObjectId.isValid(policyId)) {
            return res.status(400).json({ message: 'Invalid policy ID format' });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        if (!mongoose.Types.ObjectId.isValid(claimId)) {
            return res.status(400).json({ message: 'Invalid claim ID format' });
        }
        // Validate existence
        const policy = await Policy.findById(policyId);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const claim = await Claim.findById(claimId);
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }
        // Create payment
        const payment = new Payment({ policyId, userId, claimId, amount, paymentDate, method, status });
        await payment.save();

        // If payment is paid, update the claim status to completed
        if (payment.status === 'paid') {
            await Claim.findByIdAndUpdate(payment.claimId, { status: 'completed' });
        }

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentByUser = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const User = require('../models/User');
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const policies = await Policy.find({ userId });
        const policyIds = policies.map(policy => policy._id);
        const payments = await Payment.find({ policyId: { $in: policyIds } });
        if (payments.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentByClaim = async (req, res) => {
    try {
        const claimId = req.params.claimId;
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(claimId)) {
            return res.status(400).json({ message: 'Invalid claim ID format' });
        }
        const Claim = require('../models/Claim');
        const claim = await Claim.findById(claimId);
        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }
        const payments = await Payment.find({ claimId });
        if (payments.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};