const express = require('express');
const router = express.Router();
const {
  getSystemStatus,
  togglePump,
  updateSettings,
} = require('../controllers/controlController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Control
 *   description: Pump control and system status (Requires Login)
 */

/**
 * @swagger
 * /api/control/status:
 *   get:
 *     summary: Get current system status
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pumpStatus:
 *                   type: boolean
 *                 onlineStatus:
 *                   type: string
 *                   example: "Online"
 *                 batteryLevel:
 *                   type: number
 *       401:
 *         description: Not Authorized
 */
router.get('/status', protect, getSystemStatus);

/**
 * @swagger
 * /api/control/pump:
 *   post:
 *     summary: Turn Pump ON or OFF (Admin Only)
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: true = ON, false = OFF
 *     responses:
 *       200:
 *         description: Pump switched successfully
 *       401:
 *         description: Not Authorized (User is not Admin)
 */
router.post('/pump', protect, admin, togglePump);

/**
 * @swagger
 * /api/control/settings:
 *   put:
 *     summary: Update threshold settings (Admin Only)
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moistureThreshold:
 *                 type: number
 *               automaticMode:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/settings', protect, admin, updateSettings);

module.exports = router;
