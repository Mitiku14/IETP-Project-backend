// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller functions
// MAKE SURE these names match exactly what is in dataController.js
const { postSensorData, getHistory } = require('../controllers/dataController');

router.post('/reading', postSensorData);
router.get('/history', getHistory);

module.exports = router;
