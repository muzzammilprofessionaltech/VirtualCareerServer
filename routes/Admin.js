const express = require('express')
const { signUp, signIn, getAdmins, getCandidates, getOrganizations, deleteCandidate, deleteOrganization, blockCandidate,blockOrganization } = require('../controllers/Admin')
const router = express.Router()
const { authentication } = require('../functions/authentication')

router.post('/',signUp)
router.post('/signin', signIn)
router.get('/getadmins', getAdmins)
router.get('/getcandidates', getCandidates)
router.get('/getorganizations', getOrganizations)
router.put('/deletecandidate', deleteCandidate)
router.put('/deleteorganization', deleteOrganization)
router.put('/blockcandidate', blockCandidate)
router.put('/blockorganization', blockOrganization)

module.exports = router