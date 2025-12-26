const express = require('express');
const router = express.Router();
const {
  getSystemStatus,
  togglePump,
  updateSettings,
} = require('../controllers/controlController');

// Import the Security Guards
const { protect, admin } = require('../middleware/authMiddleware');

// 🟢 Everyone (who is logged in) can SEE the status
router.get('/status', protect, getSystemStatus);

// 🔴 ONLY Admins can CONTROL the pump
router.post('/pump', protect, admin, togglePump);

// 🔴 ONLY Admins can CHANGE settings
router.put('/settings', protect, admin, updateSettings);

module.exports = router;
