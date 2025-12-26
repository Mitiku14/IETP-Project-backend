const express = require('express');
const router = express.Router();
const { postSensorData, getHistory } = require('../controllers/dataController');

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Sensor readings and History
 */

/**
 * @swagger
 * /api/data/reading:
 *   post:
 *     summary: Upload sensor data (Used by Hardware)
 *     tags: [Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - soilMoisture
 *               - temperature
 *               - humidity
 *               - batteryLevel
 *             properties:
 *               soilMoisture:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               batteryLevel:
 *                 type: number
 *     responses:
 *       200:
 *         description: Data saved, returns automation command
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 command:
 *                   type: string
 *                   example: "PUMP_ON"
 */
router.post('/reading', postSensorData);

/**
 * @swagger
 * /api/data/history:
 *   get:
 *     summary: Get last 50 readings for Graphs
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Array of history data
 */
router.get('/history', getHistory);

module.exports = router;
