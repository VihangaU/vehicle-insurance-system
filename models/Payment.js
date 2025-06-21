const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    method: {
        type: String,
        enum: ['credit card', 'bank transfer', 'cash', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['completed', 'failed', 'pending'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema); 