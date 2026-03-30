const express = require('express');
const { startInterview, answerQuestion } = require('../controllers/interviewController');
const router = express.Router();

router.post('/start', startInterview);
router.post('/answer', answerQuestion);

module.exports = router;
