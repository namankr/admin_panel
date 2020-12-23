const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/userModel');
const routes = require('./routes/route.js');
var multer = require('multer');
var upload = multer();

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const app = express();

const PORT = process.env.PORT || 3000;

mongoose
    .connect('mongodb+srv://root:root@cluster0.mjzrf.mongodb.net/rbac')
    .then(() => {
        console.log('Connected to the Database successfully');
    });

//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(upload.array()); 

app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();
});


app.use(async (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
        }
        res.app.loggedInUser = await User.findById(userId); next();
    } else {
        next();
    }
});

app.use('/', routes); app.listen(PORT, () => {
    console.log('Server is listening on Port:', PORT)
})