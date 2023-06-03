const cors = require('cors')
const http = require('http');
require('dotenv').config()

const {userController} = require("./controllers/user.controller");
const {roleController} = require("./controllers/roles.controller");
const {folderController} = require("./controllers/folder.controller");
const port = process.env.PORT || 7777;

const server = http.createServer( async(req,res) => {
    if(req.url.startsWith('/users')) {
            await userController(req,res)
    } else if(req.url.startsWith('/role')) {
            await roleController(req,res)
    } else if(req.url.startsWith('/folder')) {
            await folderController(req,res)
    }
    else {
        res.writeHead(300,{
            "Content-type":"application/json"
        })
        let resp = {
            status:"Bad Request",
            message:"Endpoint not found"
        }
    }
});

server.listen(port,() => {
    console.log(`Server started at ${port}`)
})