const express = require('express');
const TimeController = require('../controllers/timeController');

const router = express.Router();

// GET server time
router.get('/get-current-time', TimeController.getCurrentTime);

module.exports = router;
