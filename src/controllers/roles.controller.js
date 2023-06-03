const {getRoleById,getRoles,createRole,updateRole,deleteRole} = require("../services/roles.service")

async function roleController(req,res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === "/role") {
            await getRoles(req, res);
        } else if (pathname.startsWith("/role/")) {
            const userId = pathname.split("/")[2];
            await getRoleById(req, res, userId);
        }
    }
    else if(req.method === "POST") {
        await createRole(req,res)
    }
    else if(req.method === "DELETE") {
        await deleteRole(req,res)
    }
    else if(req.method === "PATCH") {
        await updateRole(req,res)
    } else {
        res.writeHead(300,{
            'Content-type':'application/json'
        })
        let resp = {
            message:'Endpoint not found',
            status:300
        }
        res.end(JSON.stringify(resp))
    }
}

module.exports = {
    roleController
}