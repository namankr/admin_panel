// server/models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    createdBy:Schema.ObjectId,
    createdAt: { type: Date, required: true, default: Date.now }

});

const Task = mongoose.model('task', TaskSchema);

module.exports = Task;