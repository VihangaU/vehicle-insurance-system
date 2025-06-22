const Policy = require('../models/Policy');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// Function to automatically update policy status based on dates
const updatePolicyStatus = async (policy) => {
    const now = new Date();
    const endDate = new Date(policy.endDate);

    if (now > endDate) {
        policy.status = 'expired';
        await policy.save();
    }
    return policy;
};

// Function to update all policies status automatically
exports.updateAllPolicyStatuses = async () => {
    try {
        const policies = await Policy.find({ status: 'active' });
        for (const policy of policies) {
            await updatePolicyStatus(policy);
        }
        console.log('Policy statuses updated automatically');
    } catch (error) {
        console.error('Error updating policy statuses:', error);
    }
};

exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();
        if (policies.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyById = async (req, res) => {
    try {
        // Check if ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        const policy = await Policy.findById(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // Update status if needed before returning
        const updatedPolicy = await updatePolicyStatus(policy);
        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const { userId, vehicleId, name, description, coverageDetails, premium, durationMonths, startDate, endDate } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate vehicleId
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({ message: 'Invalid vehicle ID format' });
        }
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if vehicle belongs to the user
        if (vehicle.ownerId.toString() !== userId) {
            return res.status(403).json({ message: 'Vehicle does not belong to this user' });
        }

        const policy = new Policy({ userId, vehicleId, name, description, coverageDetails, premium, durationMonths, startDate, endDate });
        await policy.save();
        res.status(201).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        // Check if ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        // Update status if needed after update
        const updatedPolicy = await updatePolicyStatus(policy);
        res.status(200).json(updatedPolicy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        // Check if ID is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json({ message: 'Policy deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyByUser = async (req, res) => {
    try {
        // Check if userId is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user exists
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const policies = await Policy.find({ userId: req.params.userId });
        if (policies.length === 0) {
            return res.status(204).send();
        }

        // Update status for all policies before returning
        for (const policy of policies) {
            await updatePolicyStatus(policy);
        }

        // Fetch updated policies
        const updatedPolicies = await Policy.find({ userId: req.params.userId });
        res.status(200).json(updatedPolicies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyByVehicle = async (req, res) => {
    try {
        // Check if vehicleId is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(req.params.vehicleId)) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if vehicle exists
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const policies = await Policy.find({ vehicleId: req.params.vehicleId });
        if (policies.length === 0) {
            return res.status(204).send();
        }

        // Update status for all policies before returning
        for (const policy of policies) {
            await updatePolicyStatus(policy);
        }

        // Fetch updated policies
        const updatedPolicies = await Policy.find({ vehicleId: req.params.vehicleId });
        res.status(200).json(updatedPolicies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 