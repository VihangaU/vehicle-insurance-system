const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        if (vehicles.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getVehicleByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        // Check if userId is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'User not found' });
        }

        // First check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Then check for vehicles
        const vehicles = await Vehicle.find({ ownerId: userId });
        if (vehicles.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVehicle = async (req, res) => {
    const { ownerId, make, model, year, registrationNumber } = req.body;

    try {
        // Check if ownerId is valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: 'Invalid owner ID format' });
        }

        // Check if user exists and has role 'user'
        const user = await User.findById(ownerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Only users can own vehicles' });
        }

        const vehicle = new Vehicle({ ownerId, make, model, year, registrationNumber });
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