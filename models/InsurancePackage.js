const mongoose = require('mongoose');

const insurancePackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    annualCost: {
        type: Number,
        required: true,
    },
    coverage: {
        type: String,
        required: true,
    }
});

const insurancePackage = mongoose.model('InsurancePackage', insurancePackageSchema);
module.exports = insurancePackage;