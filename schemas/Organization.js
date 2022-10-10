const mongoose = require('mongoose');

const organization = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    social: {
        type: String,
        required: [true, "link is required"]
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
    chatRoom: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
    chatQueue: {
        type: [mongoose.SchemaTypes.ObjectId]
    },
    chatHistory: {
        type: [mongoose.SchemaTypes.ObjectId]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Organization", organization)