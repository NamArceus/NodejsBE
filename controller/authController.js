const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Player = require("../models/User");

const {registerValidation, loginValidation} = require("../routes/Validator");

const authController = {

    //REGISTER
    registerUser: async (req, res) => {
        try {
            const { username, password, role } = req.body;
            const {error} = registerValidation.validate(req.body);
            if(error) return res.status(400).json(error.details[0].message);
            
            //Kiểm tra xem người dùng đã tồn tại chưa
            const existUser = await Player.findOne({username});
            if(existUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }


            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await new Player({
                username,
                password: hashedPassword,
                role
            });

            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error register');
        }
    },


    
    //LOGIN 
    loginUser: async (req, res) => {
        try {
            console.log(req);
            const {username, password} = req.body;
            console.log(username, password);

            // Validate login data
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);


            const user = await Player.findOne({username});
            console.log(user);
            
            if (!user) {
                return res.status(401).send('Username not found');
            }


            const validPassword = await bcrypt.compare(password, user.password);  // So sánh password nhập vào với password đã mã hóa trong DB
            if (!validPassword) {
                return res.status(401).send('Mật khẩu không đúng');
            }

            // Tạo Access Token
            const accessToken = jwt.sign(
                { userId: user._id, username: user.username, role: user.role},
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' }  
            );

            // Tạo Refresh Token
            const refreshToken = jwt.sign(
                { userId: user._id, username: user.username, user: user.role},
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }  
            );

            // Lưu Refresh Token vào cơ sở dữ liệu
            user.refreshToken = refreshToken;
            await user.save();  // Cập nhật thông tin người dùng trong DB

            res.status(200).json({user, accessToken }); 
            
    }
        catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },


    
    //REQUEST REFRESH TOKEN
    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;  // Lấy refresh token từ request body
        if (!refreshToken) return res.status(401).json({ message: "Refresh Token is required" });

        try {
            const user = await Player.findOne({ refreshToken });  
            if (!user) return res.status(403).json({ message: "Refresh Token invalid" });

            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if (err) return res.status(403).json({ message: "Refresh Token invalid" });

                const accessToken = jwt.sign(
                    { userId: user._id, username: user.username },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '15m' }  
                );

                res.json({ accessToken });  // Trả về access token mới cho client
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('server error'); 
        }
    }

}

module.exports = authController;