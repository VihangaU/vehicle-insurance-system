const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/ask', supportController.askQuestion);
router.post('/reply/:ticketId', supportController.replyToQuestion);
router.get('/user/:userId', supportController.getUserTickets);
router.get('/', supportController.getAgentTickets);
router.get('/unreplied', supportController.getUnrepliedTickets);

module.exports = router;