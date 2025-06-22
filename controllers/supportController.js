const SupportTicket = require('../models/SupportTicket');

// User asks a question
exports.askQuestion = async (req, res) => {
    try {
        const { userId, question } = req.body;
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
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.ticketId,
            { agentId, reply, status: 'answered' },
            { new: true }
        );
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User views their tickets
exports.getUserTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ userId: req.params.userId });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agent views tickets (all open or assigned to them)
exports.getAgentTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ $or: [{ agentId: req.params.agentId }, { status: 'open' }] });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 