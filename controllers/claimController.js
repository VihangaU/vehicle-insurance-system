const Claim = require('../models/Claim');

exports.getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find();
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
        const claim = new Claim(req.body);
        await claim.save();
        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClaim = async (req, res) => {
    try {
        const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!claim) return res.status(404).json({ message: 'Claim not found' });
        res.status(200).json(claim);
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
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClaimByVehicle = async (req, res) => {
    try {
        const claims = await Claim.find({ vehicleId: req.params.vehicleId });
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 