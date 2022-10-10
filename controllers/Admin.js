const Admin = require('../schemas/Admin')
const Candidate = require('../schemas/Candidate')
const Organization = require('../schemas/Organization')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signIn = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email })
        if (admin) {
            bcrypt.compare(req.body.password, admin.password, function (err, respo){
                if(err){
                    res.send(err)
                }else if(respo){
                    const token = jwt.sign({
                        email: admin.email,
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
    } catch (error) {
        res.json(error.message)
    }
}

exports.signUp = async (req, res) => {
    if (await Admin.findOne({ email: req.body.email })) {
        res.json({
            status: "succes",
            message: "User already exist"
        })
    }
    else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const admin = await Admin.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        try {
            await admin.save();
            const token = jwt.sign({
                email: req.body.email,
            }, "virtualcareer");
            res.json(token)
        } catch (error) {
            res.json({
                message: error.message
            })
        }
    }
}

exports.getAdmins = async (req, res) => {
    res.json(await Admin.find({}))
}

exports.getCandidates = async (req, res) => {
    res.json(await Candidate.find({}, { password: 0 }))
}

exports.getOrganizations = async (req, res) => {
    res.json(await Organization.find({}, { password: 0 }))
}

exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({email: req.body.email}, {isDeleted: 1})
        if(candidate){
            if(candidate.isDeleted == 0){
                candidate.isDeleted = 1
                candidate.save()
                res.json({
                    status: "succes",
                    message: "Candidate Deleted"
                })
            }
            else{
                res.json({
                    status: "failure",
                    message: "Candidate was already deleted"
                })
            }
        }
        else{
            res.json({
                status: "failure",
                message: "Candidate not found"
            })
        }
    } catch (error) {
        (error.message)
    }
}

exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findOne({email: req.body.email}, {isDeleted: 1})
        if(organization){
            if(organization.isDeleted == 0){
                organization.isDeleted = 1
                organization.save()
                res.json({
                    status: "succes",
                    message: "Organization Deleted"
                })
            }
            else{
                res.json({
                    status: "failure",
                    message: "Candidate was already deleted"
                })
            }
        }
        else{
            res.json({
                status: "failure",
                message: "Organization not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.blockCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({email: req.body.email}, {isBlocked: 1})
        if(candidate){
            if(candidate.isBlocked == 0){
                candidate.isBlocked = 1
            }else{
                candidate.isBlocked = 0
            }
            candidate.save()
            res.json({
                status: "succes",
                message: candidate.isBlocked == 1 ? "Candidate Blocked" : "Candidate Restored"
            })
        }
        else{
            res.json({
                status: "failure",
                message: "Candidate not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}

exports.blockOrganization = async (req, res) => {
    try {
        const organization = await Organization.findOne({email: req.body.email}, {isBlocked: 1})
        if(organization){
            if(organization.isBlocked == 0){
                organization.isBlocked = 1
            }else{
                organization.isBlocked = 0
            }
            organization.save()
            res.json({
                status: "succes",
                message: organization.isBlocked == 1 ? "Organization Blocked" : "Organization Restored"
            })
        }
        else{
            res.json({
                status: "failure",
                message: "Candidate not found"
            })
        }
    } catch (error) {
        res.json(error.message)
    }
}