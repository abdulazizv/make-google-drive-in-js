const cors = require('cors')
const http = require('http');
require('dotenv').config()

const {userController} = require("./controllers/user.controller");
const {roleController} = require("./controllers/roles.controller");
const {folderController} = require("./controllers/folder.controller");
const fileparser = require("./shared/fileparser/fileparser")
const { drivesController } = require("./controllers/drives.controller");

const port = process.env.PORT || 7777;

const server = http.createServer( async(req,res) => {
    if(req.url.startsWith('/users')) {
            await userController(req,res)
    } else if(req.url.startsWith('/role')) {
            await roleController(req,res)
    } else if(req.url.startsWith('/folder')) {
            await folderController(req,res)
    } else if(req.url.startsWith('/drive')) {
            await drivesController(req,res)
    }
    else if(req.url === "/api/upload" && req.method === "POST") {
            await fileparser(req)
                .then(data => {
                    res.writeHead(201,{
                        'Content-type': 'application/json utf-8'
                    })
                    const resp = {
                        message:'Success',
                        data
                    }
                    res.end(JSON.stringify(resp))
                })
                .catch(error => {
                    res.writeHead(400,{
                        'Content-type':'application/json'
                    })
                    const resp = {
                        messsage:'An error occured',
                        error
                    }
                    res.end(JSON.stringify(resp))
                })
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