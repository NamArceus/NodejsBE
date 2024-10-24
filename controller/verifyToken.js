const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header

    if (!token) {
        return res.status(401).send("Requires token for authentication");
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Token invalid");
        }
        req.user = user; // Gán thông tin user vào request
        next(); // Tiếp tục xử lý request
    });
};


const verifyTokenAndUserAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.username === req.params.username || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json("Not allowed to update");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json("You're not allowed to delete!");
    }
    });
};


module.exports = {
    verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin
};