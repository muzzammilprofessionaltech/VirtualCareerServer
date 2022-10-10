const Candidate = require('../schemas/Candidate')
const bcrypt = require('bcryptjs')
const Organization = require('../schemas/Organization')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

exports.SignIn = async (req, res) => {
    const candidate = await Candidate.findOne({ email: req.body.email })
    if (candidate) {
        bcrypt.compare(req.body.password, candidate.password, function (err, respo){
            if(err){
                res.send(err)
            }else if(respo){
                const token = jwt.sign({
                    id: candidate.id,
                    email: candidate.email,
                }, "virtualcareer");
                res.json(token)
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
}

exports.signUp = async (req, res) => {
    try {
        if (await Candidate.findOne({ email: req.body.email })) {
            res.json({
                status: "success",
                message: "User already exist"
            })
        }
        else {
            const candidate = await Candidate.create({
                name: req.body.name,
                tagLine: req.body.tagLine,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                socials: req.body.socials,
                contact: req.body.contact,
                title: req.body.title,
                description: req.body.description,
                isBlocked: req.body.isBlocked,
                isDeleted: req.body.isDeleted,
                chatHistory: req.body.chatHistory,
                messageQueue: req.body.messageQueue
            })
            await candidate.save();
            const token = jwt.sign({
                id: candidate.id,
                email: req.body.email,
            }, "virtualcareer");
            res.json(token)
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.search = async (req, res) => {
    try {
        const searchResult = await Candidate.find({name: { $regex: req.body.value, $options: "i"}})
        if(searchResult){
            res.json(searchResult)
        }else{
            res.json({
                message: "Search Result Not Found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.companyProfile = async (req, res) => {
    try {
        const data = await Organization.findOne({name: req.body.name}, {password: 0, _id: 0, chatQueue: 0, chatHistory: 0, createdAt: 0, updatedAt: 0})
        if(data){
            const {isBlocked, isDeleted, ...companyData} = data._doc
            if(isBlocked == 1) return res.json({message: "Company is Blocked"})
            if(isDeleted == 1) return res.json({message: "Company is Deleted"})
            res.json(companyData)
        }
        else{
            res.json({
                status: "failure",
                message: "Company not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.chatHistory = async (req, res) => { 
    try {
        const data = await Candidate.findOne({email: req.body.email}, {chatHistory: 1, _id: 0})
        if(data){
            res.json(data)
        }
        else{
            res.json({
                status: "failure"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.messageQueue = async (req, res) => {
    try {
        const data = await Candidate.findOne({email: req.body.email}, {messageQueue: 1, _id: 0})
        if(data){
            res.json(data)
        }
        else{
            res.json({
                status: "failure"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.candidateProfile  = async (req, res) => {
    try {
        const data = await Candidate.findOne({email: req.tokenData.email}, {password: 0, _id: 0, messageQueue: 0, chatHistory: 0})
        if(data){
            const {isBlocked, isDeleted, ...candidateData} = data._doc
            if(isBlocked == 1) res.json({message: "User is Blocked"})
            if(isDeleted == 1) res.json({message: "User is Deleted"})
            res.json(candidateData)
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

exports.editCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({email: req.tokenData.email}, {createdAt: 0})
        if(candidate){
            const {isBlocked, isDeleted} = candidate._doc
            if(isBlocked == 1) res.json({message: "User is Blocked"})
            if(isDeleted == 1) res.json({message: "User is Deleted"})
            candidate.name = req.body.name
            candidate.email = req.body.email
            candidate.contact = req.body.contact
            candidate.socials = req.body.socials
            candidate.description = req.body.description
            await candidate.save()
            const token = jwt.sign({
                email: req.body.email,
            }, "virtualcareer");
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

exports.joinBooth = async (req, res) => {
    try {
        const boothObj = await Organization.findOne({id: req.body.orgId, chatQueue: mongoose.Types.ObjectId(req.body.candidateId)}, {chatQueue: 1})
        if(boothObj == null){
            await Organization.updateOne({id: req.body.orgId}, {$addToSet: {chatQueue: req.body.candidateId}})
            await Candidate.updateOne({id: req.body.candidateId}, {$addToSet: {messageQueue: req.body.orgId}})
            res.json({
                message: "joined"
            })
        }else{
            res.json({
                message: "Already Joined"
            })
        }        
    } catch (error) {
        res.json(error.message)
    }
}