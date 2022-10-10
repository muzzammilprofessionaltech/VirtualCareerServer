const Organization = require('../schemas/Organization')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Candidate = require('../schemas/Candidate')

exports.SignIn = async (req, res) => {
    try {
        const organization = await Organization.findOne({ email: req.body.email })
        if (organization){
            bcrypt.compare(req.body.password, organization.password, function (err, respo){
                if(err){
                    res.json({
                        status: "failure",
                        message: err.message
                    })
                }else if(respo){
                    const token = jwt.sign({
                        email: organization.email,
                        password: organization.password
                    }, "virtualcareer", {expiresIn: "24h"});
                    res.json({
                        status: "success",
                        message: "User LoggedIn",
                        token: token
                    })
                }else{
                    res.json({
                        status: "failure",
                        message: "Incorrect Password"
                    })
                }
            })
        }
        else {
            res.json({
                status: "failure",
                message: "Email not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.signUp = async (req, res) => {
    try {
        if (await Organization.findOne({ email: req.body.email })) {
            res.json({
                status: "succes",
                message: "User already exist"
            })
        }
        else {
            const organization = await Organization.create({
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                social: req.body.social,
                contact: req.body.contact,
                title: req.body.title,
                description: req.body.description,
                isBlocked: req.body.isBlocked,
                isDeleted: req.body.isDeleted,
                chatHistory: req.body.chatHistory,
                chatQueue: req.body.chatQueue
            })
            await organization.save();
            const token = jwt.sign({
                email: req.body.email,
            }, "virtualcareer", {expiresIn: "24h"});
            res.json(token)
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.organizationProfile = async (req, res) => {
    const data = await Organization.findOne({email: req.tokenData.email}, {password: 0, chatQueue: 0, chatHistory: 0})
    if(data){
        const {isBlocked, isDeleted, ...organizationData} = data._doc
        if(isBlocked == 1) return res.json({message: "Organization is Blocked"})
        if(isDeleted == 1) return res.json({message: "Organization is Deleted"})
        res.json(organizationData)
    }
    else{
        res.json({
            status: "failure",
            message: "Company not found"
        })
    }
}

exports.editOrganization = async (req, res) => {
    try {
        const organization = await Organization.findOne({email: req.tokenData.email}, {createdAt: 0, password: 0})
        if(organization){
            const {isBlocked, isDeleted} = organization._doc
            if(isBlocked == 1) res.json({message: "User is Blocked"})
            if(isDeleted == 1) res.json({message: "User is Deleted"})
            organization.name = req.body.name
            organization.email = req.body.email
            organization.contact = req.body.contact
            organization.social = req.body.social
            organization.description = req.body.description
            await organization.save()
            const token = jwt.sign({
                email: req.body.email,
                password: req.body.password
            }, "virtualcareer", {expiresIn: "24h"});
            res.json(token)
        }
        else{
            res.json({
                status: "failure",
                message: "User not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.getOrganizations = async (req, res) => {
    res.json(await Organization.find({}, { password: 1 }).skip(10).limit(5))
}

exports.addToChat = async (req, res) => {
    try {
        const boothObj = await Organization.findOne({id: req.body.orgId, chatQueue: mongoose.Types.ObjectId(req.body.candidateId), chatRoom: {$ne: mongoose.Types.ObjectId(req.body.candidateId)}}, {chatQueue: 1})
        if(boothObj){
            await Organization.updateOne({id: req.body.orgId},{
                $pullAll: {
                    chatQueue: [req.body.candidateId]
                },
                $addToSet: {
                    chatRoom: req.body.candidateId
                }
            })
            res.json({
                status: "success",
                message: "Added to ChatRoom"
            })
        }else{
            const obj = await Organization.findOne({id: req.body.objectId, chatRoom: mongoose.Types.ObjectId(req.body.candidateId)}, {chatQueue: 1})
            if(obj != null){
                res.json({
                    message: "Already In ChatRoom"
                })
            }else{
                res.json({
                    status: "failed",
                    message: "Not in ChatQueue"
                })
            }
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.endChat = async (req, res) => {
    try {
        const chatCandidate = await Organization.findOne({id: req.body.orgId, chatRoom: mongoose.Types.ObjectId(req.body.candidateId), chatHistory: {$ne: mongoose.Types.ObjectId(req.body.candidateId)}}, {chatHistory: 1})
        if(chatCandidate){
            await Organization.updateOne({id: req.body.objectId},{
                $pullAll: {
                    chatRoom: [req.body.candidateId]
                },
                $addToSet: {
                    chatHistory: req.body.candidateId
                }
            })
            await Candidate.updateOne({id: req.body.objectId},{
                $pullAll: {
                    messageQueue: [req.body.orgId]
                },
                $addToSet: {
                    chatHistory: req.body.orgId
                }
            })
            res.json({
                status: "success",
                message: "Chat Ended"
            })
        }else{
            const obj = await Organization.findOne({id: req.body.orgId, chatHistory: mongoose.Types.ObjectId(req.body.candidateId)}, {chatQueue: 1})
            if(obj){
                res.json({
                    message: "Already In ChatHistory"
                })
            }else{
                res.json({
                    status: "failed",
                    message: "Not in ChatRoom"
                })
            }
        }
    } catch (error) {
        res.json(error.message)
    }
}