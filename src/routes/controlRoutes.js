const express = require('express');
const router = express.Router();
const {
  getSystemStatus,
  togglePump,
  updateSettings,
} = require('../controllers/controlController');


const { protect, admin } = require('../middleware/authMiddleware');

router.get('/status', protect, getSystemStatus);


router.post('/pump', protect, admin, togglePump);


router.put('/settings', protect, admin, updateSettings);

module.exports = router;
