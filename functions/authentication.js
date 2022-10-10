const jwt = require('jsonwebtoken')

exports.authentication = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.sendStatus(401)
    jwt.verify(token, "virtualcareer", (err, tokenData) => {
        if(err) return res.sendStatus(403)
        console.log(tokenData)
        req.tokenData = tokenData
        next()
    }) 
}