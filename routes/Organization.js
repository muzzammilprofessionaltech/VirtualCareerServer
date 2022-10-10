const express = require('express')
const { signUp, SignIn, organizationProfile, editOrganization, addToChat, endChat } = require('../controllers/Organization')
const router = express.Router()
const { authentication } = require('../functions/authentication')

router.post('/', signUp)
router.post('/signin', SignIn)
router.get('/profile', authentication, organizationProfile)
router.put('/editprofile', authentication, editOrganization)
router.put('/addtochat', addToChat)
router.put('/endchat', endChat)

module.exports = router