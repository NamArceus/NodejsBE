const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');


//POST REGISTER
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Server error or unable to register user
 *     security:
 *       - bearerAuth: []
 */

router.post('/register', authController.registerUser);




//POST LOGIN
/**
 * @swagger
 * /api/login:
 *  post:
 *    summary: Log user into the system
 *    description: Login player
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - username
 *              - password
 *    responses:
 *      '200':
 *        description: Login success.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Access token for authenticated user.
 *      '401':
 *        description: Username or Password is incorrect
 *      '500':
 *        description: Server error.
 *    security:
 *      - bearerAuth: []
 */

router.post('/login',authController.loginUser);



router.post('/refresh', authController.refreshToken);

module.exports = router;