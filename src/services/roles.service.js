const {fetch,fetchAll} = require("../database/connection");
const {basicErrorhandler,notFoundResponse,getBodyData} = require("../shared/helpers/index")



async function getRoleById(req,res){
    try {
        const id = req.url.split("/")[2];
        const role = await fetch('select * from role where id = $1',id);
        if(!role) {
            notFoundResponse(res,'In table not found this id role')
        }
        res.writeHead(200,{
            "Content-type":"application/json charset utf-8"
        })
        res.end(JSON.stringify(role))
    } catch (e) {
        console.log(e)
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getRoles(req,res) {
    try {
        let data = await fetchAll('select * from role');
        if(data.length < 1) {
            notFoundResponse(res,'Roles not found')
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

async function createRole(req,res) {
    try{
        let data = await getBodyData(req);
        const { role_name } = JSON.parse(data);
        const check = await fetch('INSERT INTO role(role_name) values($1) returning id',role_name);
        res.writeHead(201,{
            'Content-type':'application/json'
        })
        const resp  = {
            status:"OK",
            id:check.id
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.log(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

async function deleteRole(req,res) {
    try{
        const id = req.url.split("/")[2];
        const deletedRole = await fetch('DELETE FROM role WHERE id=$1 returning role_name',id);
        res.writeHead(202,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"Successfully deleted",
            deletedRole
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.error(e)
        basicErrorhandler(res,`${e.message}`)
    }
}

async function updateRole(req,res) {
    try {
        const id = req.url.split("/")[2];
        const body = await getBodyData(req);
        const { role_name } = JSON.parse(body);
        const data = await fetch('UPDATE role SET role_name=$1 WHERE id=$2 returning id,role_name',role_name,id);
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


module.exports = {
    getRoleById,
    getRoles,
    createRole,
    deleteRole,
    updateRole

}