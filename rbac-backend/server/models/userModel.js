// server/models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'Mentor',
        enum: ["Mentor", "Admin"]
    },
    accessToken: {
        type: String
    },
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    createdBy: Schema.ObjectId,
    createdAt: { type: Date, required: true, default: Date.now },
    updatedBy: Schema.ObjectId,
    updatedAt: { type: Date, required: true, default: Date.now },
    tasks: [],
    status: {
        type: String,
        default: 'Active',
        enum: ['Active',"InActive", "Invited"],
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;