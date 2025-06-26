const Claim = require('../models/Claim');
const Payment = require('../models/Payment');

exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find();
        if (claims.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClaimById = async (req, res) => {
    try {
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createClaim = async (req, res) => {
    try {
        const { policyId, userId, vehicleId, claimDate, amountClaimed, status, description } = req.body;

        if (!policyId || !userId || !vehicleId) {
            return res.status(400).json({ message: 'policyId, userId, and vehicleId are required' });
        }
        if (!require('mongoose').Types.ObjectId.isValid(policyId)) {
            return res.status(400).json({ message: 'Invalid policy ID format' });
        }
        if (!require('mongoose').Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        if (!require('mongoose').Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID format' });
        }

        const Policy = require('../models/Policy');
        const User = require('../models/User');
        const Vehicle = require('../models/Vehicle');
        const policy = await Policy.findById(policyId);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const claim = new Claim({ policyId, userId, vehicleId, claimDate, amountClaimed, status, description });
        await claim.save();
        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClaim = async (req, res) => {
    try {
        const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedClaim) return res.status(404).json({ message: 'Claim not found' });

        // Sync payment status based on claim status, but only for payments with this claimId
        if (updatedClaim.status === 'completed') {
            await Payment.updateMany(
                { claimId: updatedClaim._id },
                { status: 'paid' }
            );
        } else if (updatedClaim.status === 'pending') {
            await Payment.updateMany(
                { claimId: updatedClaim._id },
                { status: 'pending' }
            );
        }

        res.status(200).json(updatedClaim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClaim = async (req, res) => {
    try {
        const claim = await Claim.findByIdAndDelete(req.params.id);
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json({ message: 'Claim deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClaimByUser = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.params.userId });
        if (claims.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClaimByVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID format' });
        }
        const Vehicle = require('../models/Vehicle');
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const claims = await Claim.find({ vehicleId });
        if (claims.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};