const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");

//jwt token
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Multer upload
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Khai báo và khởi tạo options trước
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [{
            url: 'http://localhost:8000',
        }],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./routes/player-routes.js'], 
};

// Sau đó khai báo swaggerDocument
const swaggerDocument = swaggerJsdoc(options);

app.use(bodyParser.json({limit:"50mb"})); 
app.use(cors());
app.use(morgan("common"));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 


dotenv.config();



//Connect mongodb
mongoose.connect("mongodb://localhost:27017/arceus")
.then(() => {
    console.log("Connected to Database!");
})
.catch(() => {
    console.log("Connection Failed!");
});


app.listen(8000, () => {
    console.log("Server is running");
});

//Create database player
const Schema = mongoose.Schema;


/*const players = new Schema({
    firstName: {type: 'string', required: true},
    lastName: {type: 'string', required: true},
    gender : {type: 'string', required: true},
    team: {type: 'string', required: true }
});


const Player0 = mongoose.model('player', player);

const player0 = {
    firstName: 'Nhat',
    lastName: 'Nam',
    gender: 'Male',
    team: 'Manchester United'
}



//Create players in database
const user0 = Player.create(player0)
    .then((e) => {
        console.log('Player created successfully');
        console.log(e); 
    })
    .catch(err => {
        console.error('Error creating player:', err);
    });


app.get('/api/players' , (req, res) => {
    res.json(player0);
});



app.post('/resgister', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    AccountModel.create({ 
        username: username,
        password: password })
    .then(data => {
        res.json('Tao tai khoan thanh cong')
    })
    .catch(err => {
        res.status(500).send('Tao tai khoan that bai')
    })
});

app.get('/', (req, res) => {
    res.json('Home');
})*/


const player = new Schema({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    refreshToken: {type: 'string'},
    role: {type: 'string', enum: ['admin','guest'], default: 'guest'}
    
});


const Player = mongoose.model('player', player);

/*const player1 = {
    username: 'admin',
    password: '123456789'
}





// players in database
const user = Player.findOneAndUpdate({username: player1.username}, {$set: {password: 123456789}} )
    .then((updateplayer) => {
        console.log('Player update successfully');
        console.log(updateplayer); 
    })
    .catch(err => {
        console.error('Error update player:', err); 
    });*/

/*app.post('/api/register', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    Player.create({
        username: username,
        password: password
    })
    .then(data => {
        res.json('Tao tai khoan thanh cong')
    })
    .catch(err => {
        res.status(500).send('Tao tai khoan that bai')
    })
})


app.get('/api/players' , (req, res) => {
    res.json(player1);
});*/



//api register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await new Player({
            username,
            password: hashedPassword,
            role: role || 'guest'
        });


        

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error register');
    }
});

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

//login

app.post('/api/login', async (req, res) => {
    try {
        
        console.log(req);
        const {username, password} = req.body;
        console.log(username, password);


        const user = await Player.findOne({username});
        console.log(user);
        
        if (!user) {
            return res.status(401).send('Username not found');
        }

        
        /*const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword){
            return res.status(401).send('Invalid password');
        }
        
        

       if(password === user.password){
        const accessToken = jwt.sign({ userId: user._id , username:user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
         res.json(accessToken); 
       } 
       else {
        res.status(401).send("Invalid password");
       }*/

        const validPassword = await bcrypt.compare(password, user.password);  // So sánh password nhập vào với password đã mã hóa trong DB
        if (!validPassword) {
            return res.status(401).send('Mật khẩu không đúng');  // Nếu password không khớp, trả về lỗi
        }

        // Tạo Access Token
        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }  // Thời gian sống của token là 15 phút
        );

        // Tạo Refresh Token
        const refreshToken = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }  // Thời gian sống của refresh token là 7 ngày
        );

        // Lưu Refresh Token vào cơ sở dữ liệu
        user.refreshToken = refreshToken;
        await user.save();  // Cập nhật thông tin người dùng trong DB

        res.status(200).json({user, accessToken, refreshToken });
        
}
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
    
});





//DELETE
app.delete('/api/delete/:username', requireAdmin , async(req, res, next) => {
    const username = req.params.username;
    try {
        const user = await Player.findOneAndDelete({username});
        if(!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json('Delete success');

    }
    catch (err) {
        return res.status(500).json(err);
    }
});



//UPDATE
app.put('/api/update', async(req, res) => {
    try {
        const {_id, newUsername, newPassword } = req.body;
        const user = await Player.findOneAndUpdate(_id ,{
            username: newUsername,
            password: newPassword
        });
        if(!user){
            return res.status(404).send('User not found');
        }

        res.status(200).send("User update success");
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});



//UPLOAD
app.post('/api/upload' , upload.single('file') , async (req, res) => {
    console.log(req.file);
    res.status(200).send('Upload successful');
})




// VERIFY
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];  // Lấy header authorization
    const token = authHeader && authHeader.split(' ')[1];  // Tách Bearer và token

    if (token == null) return res.status(401).send("Requires token for authentication");

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token invald");
        req.user = user;  // Gán thông tin user vào request
        next();  // Tiếp tục xử lý request
    });
};

//PROTECTED
app.get('/protected-route', verifyToken, (req, res) => {
    res.status(200).send('Protected');
});



//REFRESH TOKEN
app.post('/api/token', async (req, res) => {
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
});