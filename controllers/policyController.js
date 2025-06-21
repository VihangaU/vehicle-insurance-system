const Policy = require('../models/Policy');

exports.getAllPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyById = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const policy = new Policy(req.body);
        await policy.save();
        res.status(201).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePolicy = async (req, res) => {
    try {
        const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
        res.status(200).json({ message: 'Policy deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyByUser = async (req, res) => {
    try {
        const policies = await Policy.find({ userId: req.params.userId });
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolicyByVehicle = async (req, res) => {
    try {
        const policies = await Policy.find({ vehicleId: req.params.vehicleId });
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 