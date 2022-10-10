const mongoose = require('mongoose');

const candidate = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    tagLine: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    socials: {
        type: [String],
        required: true
    },
    contact: {
        type: String,
        required: [true, "contact is required"]
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    isBlocked: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    isDeleted: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    },
    messageQueue: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
    chatHistory: {
        type: [mongoose.SchemaTypes.ObjectId]
        // type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Candidate", candidate)