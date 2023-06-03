const {fetch,fetchAll} = require("../database/connection");
const {basicErrorhandler,notFoundResponse,getBodyData} = require("../shared/helpers/index")
const {generateToken,verifyRefreshToken,verifyAccessToken,hashPassword,comparePassword} = require('../shared/auth/jwt.service')


async function getUserById(req,res){
    try {
        const id = req.url.split("/")[2];
        const user = await fetch('select * from users where id = $1',id);
        if(!user) {
            notFoundResponse(res,'In table not found this id user')
        }
        res.writeHead(200,{
            "Content-type":"application/json charset utf-8"
        })
        res.end(JSON.stringify(user))
    } catch (e) {
        console.log(e)
        basicErrorhandler(res,`${e.message}`)
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
        basicErrorhandler(res,`${e.message}`)
    }
}

async function createUsers(req,res) {
    try{
        let data = await getBodyData(req);
        const { email,password } = JSON.parse(data);
        const hashedPassword = hashPassword(password)
        const check = await fetch('INSERT INTO users(email,password) values($1,$2) returning id',email,hashedPassword);
        let payload = {
            id:check.id,
            email
        }
        const tokens = await generateToken(payload);
        await changeToken(res,check.id,tokens.refresh_token)
        res.writeHead(201,{
            'Content-type':'application/json'
        })
        const resp  = {
            status:"OK",
            id:check.id,
            token: tokens.access_token
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.log(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

async function changeToken(res,id,token) {
    try{
        await fetch('UPDATE users SET token=$1 WHERE id=$2',token,id)
        return true;
    } catch(e) {
        console.error(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

module.exports = {
    getUserById,
    getUsers,
    createUsers
}