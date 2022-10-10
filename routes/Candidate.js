const express = require('express')
const { signUp, SignIn, chatHistory, companyProfile, messageQueue, candidateProfile, editCandidate, joinBooth } = require('../controllers/Candidate')
const router = express.Router()
const { authentication } = require('../functions/authentication')

router.post('/',  signUp)
router.post('/signin', SignIn)
router.get('/chathistory', chatHistory)
router.get('/messagequeue', messageQueue)
router.get('/companyprofile', companyProfile)
router.get('/profile', authentication, candidateProfile)
router.put('/editprofile', editCandidate)
router.put('/joinbooth', joinBooth)

module.exports = router