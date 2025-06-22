const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');

// User asks a question
exports.askQuestion = async (req, res) => {
    try {
        const { userId, question } = req.body;
        // Check user role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'user') {
            return res.status(403).json({ message: 'Only users can ask questions' });
        }
        const ticket = new SupportTicket({ userId, question });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agent replies to a question
exports.replyToQuestion = async (req, res) => {
    try {
        const { agentId, reply } = req.body;
        // Validate ticket existence first
        const ticketExists = await SupportTicket.findById(req.params.ticketId);
        if (!ticketExists) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        // Check agent role
        const agent = await User.findById(agentId);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        if (agent.role !== 'agent') {
            return res.status(403).json({ message: 'Only agents can reply to questions' });
        }
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.ticketId,
            { agentId, reply, status: 'replied' },
            { new: true }
        );
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User views their tickets
exports.getUserTickets = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const User = require('../models/User');
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const tickets = await SupportTicket.find({ userId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agent views tickets (all open or assigned to them)
exports.getAgentTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find();
        if (tickets.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agent views only tickets that haven't been replied to yet
exports.getUnrepliedTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ status: 'initial' });
        if (tickets.length === 0) {
            return res.status(204).send();
        }
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 