const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    question: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
    },
    status: {
        type: String,
        enum: ['initial', 'replied'],
        default: 'initial',
    },
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema); 