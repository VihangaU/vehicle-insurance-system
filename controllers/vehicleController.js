const Vehicle = require('../models/Vehicle');
const InsurancePackage = require('../models/InsurancePackage');

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