const {fetch,fetchAll} = require("../database/connection");
const {basicErrorhandler,notFoundResponse,getBodyData} = require("../shared/helpers/index")
const {generateToken,verifyRefreshToken,verifyAccessToken,hashPassword,comparePassword} = require('../shared/auth/jwt.service')


async function getUserById(req,res,userId){
    try {
        const id = req.url.split("/")[2];
        const user = await fetch('select * from users where id = $1',userId);
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
            token: tokens
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

async function deleteUser(req,res) {
    try{
        const id = req.url.split("/")[2];
        const deletedUser = await fetch('DELETE FROM users WHERE id=$1 returning email',id);
        res.writeHead(202,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"Successfully deleted",
            deletedUser
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.error(e)
        basicErrorhandler(res,`${e.message}`)
    }
}

async function updateUser(req,res) {
    try {
        const id = req.url.split("/")[2];
        const body = await getBodyData(req);
        const { email,password } = JSON.parse(body);
        const hashedPassword = await hashPassword(password)
        const data = await fetch('UPDATE users SET email=$1,password=$2 WHERE id=$3 returning id,email,updated_at',email,hashedPassword,id);
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"Updated succesfully",
            response: data,
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.error(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

async function signIn(req,res) {
    try {
        const body = await getBodyData(req);
        const { refresh_token } = JSON.parse(body);
        const user = await fetch('SELECT * FROM users WHERE token=$1',refresh_token);
        if(!user) {
            notFoundResponse(res,'User not found with this refresh_token')
        }
        let payload = {
            id:user.id,
            email: user.email
        }
        const tokens = await generateToken(payload);
        await fetch('UPDATE users SET token=$1 WHERE token=$2',tokens.refresh_token,refresh_token);
        res.writeHead(200,{
            'Content-type': 'application/json'
        })
        const resp = {
            status:"Successfully signin",
            token:tokens
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        console.error(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

module.exports = {
    getUserById,
    getUsers,
    createUsers,
    deleteUser,
    updateUser,
    signIn
}