// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Login and Registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: user
 *                 description: "Optional: 'user' or 'admin'"
 *               adminSecret:
 *                 type: string
 *                 description: "Required only if registering as admin"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       403:
 *         description: Invalid Admin Secret
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get Token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (Returns Token)
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

module.exports = router;
