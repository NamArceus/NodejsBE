const Player = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {

    
   // GET ALL USERS
    getAllUser: async (req, res) => {
        try {
            const users = await Player.find();  // Sử dụng số nhiều 'users' để phản ánh rằng có thể trả về nhiều người dùng
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },



    //DELETE USER
    deleteUser: async (req, res) => {
        try {
            const user = await Player.findByIdAndDelete(req.params.username);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },



    //UPDATE USER
    updateUser: async (req, res) => {
        try {
            const { newUsername, newPassword, role } = req.body;
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            const updatedUser = await Player.findByIdAndUpdate(req.params.id, {
                username: newUsername,
                password: hashedPassword,
                role: role
            }, { new: true });

            if (!updatedUser) {
                return res.status(404).send('User not found');
            }

            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating user');
        }
    },



    //UPLOAD
    uploadFile: (req, res) => {
        console.log(req.file);
        res.status(200).send('Upload successful');
    }
}


module.exports = userController;