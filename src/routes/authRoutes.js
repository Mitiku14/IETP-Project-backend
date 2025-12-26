// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Make sure the path points correctly to the file we just created above
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
