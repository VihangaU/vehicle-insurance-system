const InsurancePackage = require('../models/InsurancePackage');

exports.getAllInsurancePackages = async (req, res) => {
    try {
        const insurancePackages = await InsurancePackage.find();
        res.status(200).json(insurancePackages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createInsurancePackage = async (req, res) => {
    const { name, description, annualCost, coverage } = req.body;

    try {
        const insurancePackage = new InsurancePackage({ name, description, annualCost, coverage });
        await insurancePackage.save();
        res.status(201).json(insurancePackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};