const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const bcrypt = require("bcryptjs");


app.use(bodyParser.json({limit:"50mb"}));
app.use(cors());
app.use(morgan("common"));


dotenv.config();



//Connect mongodb
//mongoose.connect("mongodb+srv://arceus:2OxnaEw1QXR72FoY@cluster0.g0exw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect("mongodb://localhost:27017/arceus")
.then(() => {
    console.log("Connected to Database!");
})
.catch(() => {
    console.log("Connection Failed!");
});



app.listen(8000, () => {
    console.log("Server is running on port 8000");
});