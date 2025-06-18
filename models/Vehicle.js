const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
    },
    insurancePackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InsurancePackage',
    }
});

const vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = vehicle;