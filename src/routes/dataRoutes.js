// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();

const { postSensorData, getHistory } = require('../controllers/dataController');

router.post('/reading', postSensorData);
router.get('/history', getHistory);

module.exports = router;
