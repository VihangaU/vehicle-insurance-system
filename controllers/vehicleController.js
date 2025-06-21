const Vehicle = require('../models/Vehicle');
const InsurancePackage = require('../models/Policy');

exports.getVehicleByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const vehicles = await Vehicle.find({ owner: userId }).populate('insurancePackage');
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVehicle = async (req, res) => {
    const { owner, make, model, year, registrationNumber, insurancePackageId } = req.body;

    try {
        const vehicle = new Vehicle({ owner, make, model, year, registrationNumber, insurancePackage: insurancePackageId });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.status(200).json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};