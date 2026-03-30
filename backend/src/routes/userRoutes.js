const express = require('express');
const { createProfile, getProfile } = require('../controllers/userController');
const router = express.Router();

router.post('/profile', createProfile);
router.get('/profile/:id', getProfile);

module.exports = router;
