const express = require('express');
const { getStudentsList, getStudentDetails, getAnalytics, giveFeedback } = require('../controllers/teacherController');
const router = express.Router();

router.get('/students', getStudentsList);
router.get('/student/:id', getStudentDetails);
router.get('/analytics', getAnalytics);
router.post('/feedback', giveFeedback);

module.exports = router;
