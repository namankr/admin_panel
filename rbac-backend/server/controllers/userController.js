// server/controllers/userController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');
const Task = require('../models/taskModel');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}


exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.app.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

exports.signup = async (req, res, next) => {
    try {
        const { email, password, role, userName, firstName } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role || "Mentor", userName, firstName });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            accessToken
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            user,
            accessToken
        })
    } catch (error) {
        next(error);
    }
}




exports.createMentor = async (req, res, next) => {
    try {

        const { email, role, userName, firstName, lastName } = req.body;
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        const createdBy = userId;
        const newUser = new User({ email, role: role || "Mentor", userName, firstName, lastName, createdBy, status: "Active" });
        if (req.body.tasks.length > 0) {
            req.body.tasks.forEach(task => {
                const name = task.name;
                const newTask = new Task({ name, createdBy });
                newTask.save();
                newUser.tasks.push(newTask._id);
            });

        }
        await newUser.save();
        res.status(200).json({
            newUser,
            message: 'Mentor has been added !'
        });
    } catch (error) {
        next(error)
    }
}

exports.updateMentor = async (req, res, next) => {
    try {
        const { email, userName, firstName, lastName } = req.body;
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        const mentorId = req.params.mentorId;
        let updatedUser = await User.findById(mentorId);
        updatedUser.email = email;
        updatedUser.userName = userName;
        updatedUser.firstName = firstName;
        updatedUser.lastName = lastName;
        updatedUser.updatedBy = userId;
        await updatedUser.save();
        if (req.body.tasks.length > 0) {
            req.body.tasks.forEach(task => {
                const name = task.name;
                const createdBy = userId;
                const newTask = new Task({ name, createdBy });
                newTask.save();
                updatedUser.tasks.push(newTask._id);
            });
        }
        await updatedUser.save();
        res.status(200).json({
            updatedUser,
            message: 'Mentor data has been updated!'
        });
    } catch (error) {
        next(error)
    }
}


exports.deleteMentor = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message: 'Mentor has been deleted'
        });
    } catch (error) {
        next(error)
    }
}



exports.getMentors = async (req, res, next) => {
    try {
        const users = await User.find({ role: "Mentor" });
        res.status(200).json({
            data: users
        });
    } catch (error) {
        next(error)
    }
}