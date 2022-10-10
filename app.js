const mongoose = require('mongoose')

const express = require('express')
const app = express()
const port = 5000

const { Server } = require("socket.io");
const http = require('http')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const cors = require("cors")
app.use(cors())



const candidateRoute = require('./routes/Candidate')
const organizationRoute = require('./routes/Organization')
const adminRoute = require('./routes/Admin');
const Organization = require('./schemas/Organization');
const Candidate = require('./schemas/Candidate');

app.use('/candidate', jsonParser, candidateRoute)
app.use('/organization', jsonParser, organizationRoute)
app.use('/admin', jsonParser, adminRoute)

app.delete('/delete', jsonParser, async (req, res) => {
    await Candidate.deleteMany({})
    await Organization.deleteMany({})
    res.json({
        message: "succes"
    })
})

mongoose.connect(
    `mongodb+srv://professionaltech:professional123$@cluster0.tducodj.mongodb.net/virtualcareer?retryWrites=true&w=majority`
).then((result)=>{
    console.log("connected")
}).catch((err) => console.log(err))

server.listen(port)