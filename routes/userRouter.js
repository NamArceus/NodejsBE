const userController = require("../controller/userController");
const {
    verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin
} = require("../controller/verifyToken");

const router = require("express").Router();
const upload = require("../multer");



//GET ALL USERS
router.get("/", verifyToken, userController.getAllUser);


//POST DELETE
/**
 * @swagger
 * /api/delete/{username}:
 *   delete:
 *     summary: Delete a player
 *     description: Deletes a player based on the username. Requires admin privileges.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the player to be deleted.
 *     responses:
 *       '200':
 *         description: Player deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Player deleted successfully"
 *       '404':
 *         description: Player not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not found"
 *       '403':
 *         description: Access denied. Requires admin privileges.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "You're not allowed to delete!"
 *       '500':
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *     security:
 *       - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */



router.post('/api/delete/:username', verifyTokenAndUserAuthorization, userController.deleteUser);


//UPDATE
/**
 * @swagger
 * /api/update/{id}:
 *   put:
 *     summary: Update user information
 *     description: Updates a user's username and password based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newUsername:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's unique identifier.
 *                 username:
 *                   type: string
 *                   description: The updated username.
 *                 role:
 *                   type: string
 *                   description: The user's role.
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 *     security:
 *          - bearerAuth: []
 */





router.put('/api/update/:id', verifyTokenAndAdmin, userController.updateUser);



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


router.post('/upload', upload.single('file'), userController.uploadFile);

module.exports = router;