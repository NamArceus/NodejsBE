const express = require('express');
const router = express.Router();
const playercontroller = require('index.js');


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
 *         description: Missing username or password in request
 *       500:
 *         description: Server error or unable to register user
 *     security:
 *       - bearerAuth: []
 */






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

router.post('/api/login',playercontroller.post);


//POST DELETE
/**
 * @swagger
 * /api/delete/{username}:
 *  delete:
 *    summary: Delete player
 *    description: Deletes a player based on username. Requires admin privileges.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        schema:
 *          type: string
 *        description: The username of the player that needs to be deleted.
 *    responses:
 *      '200':
 *        description: Player deleted successfully.
 *      '404':
 *        description: Player not found.
 *      '403':
 *        description: Access denied. Requires admin privileges.
 *      '500':
 *        description: Server error.
 *    security:
 *      - bearerAuth: []
 */


router.post('/api/delete',playercontroller.post);


//UPDATE
/**
 * @swagger
 * /api/update:
 *   put:
 *     summary: Update user information
 *     description: Updates a user's username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The user's unique identifier
 *                 example: " "
 *               newUsername:
 *                 type: string
 *                 description: The new username to update
 *                 example: " "
 *               newPassword:
 *                 type: string
 *                 description: The new password to update
 *                 example: " "
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */




router.put('/api/updateusers',playercontroller.put);



//UPLOAD
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload.
 *     responses:
 *       '200':
 *         description: Uploaded successful
 *     security:
 *       - bearerAuth: []
 */


router.post('/api/upload', playercontroller.post);