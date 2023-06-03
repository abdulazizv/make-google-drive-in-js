const {fetch,fetchAll} = require("../database/connection");
const basicErrorhandler = require("../shared/helpers/basicErrorhandler");


async function getUserById(req,res){
    try {
        const id = req.url.split("/")[2];
        const user = await fetch('select * from users where id = $1',id);
        res.writeHead(200,{
            "Content-type":"application/json charset utf-8"
        })
        res.end(JSON.stringify(user))
    } catch (e) {
        console.log(e)
        basicErrorhandler(res,"Internal server error on getUserById")
    }
}

async function getUsers(req,res) {
    try {
        let data = await fetchAll('select * from users');
        if(data.length < 1) {
            notFoundResponse(res,'Users not found')
        }
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(JSON.stringify(data))
    } catch (e) {
        console.log(e)
        basicErrorhandler(res,'Internal server error on getAll method')
    }
}

async function createUsers(req,res) {

}
module.exports = {
    getUserById,
    getUsers
}