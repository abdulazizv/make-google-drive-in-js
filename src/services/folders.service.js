const {fetch,fetchAll} = require("../database/connection");
const {basicErrorhandler,notFoundResponse,getBodyData} = require("../shared/helpers/index")


async function getFolderById(req,res){
    try {
        const id = req.url.split("/")[2];
        const folder = await fetch('select * from folder where id = $1',id);
        if(!folder) {
            notFoundResponse(res,'In table not found this id folder')
        }
        res.writeHead(200,{
            "Content-type":"application/json charset utf-8"
        })
        res.end(JSON.stringify(folder))
    } catch (e) {
        console.log(e)
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getFolder(req,res) {
    try {
        let data = await fetchAll('SELECT * FROM folder JOIN "users" ON folder.user_id = "users".id');
        if(data.length < 1) {
            notFoundResponse(res,'Folders not found')
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

async function createFolder(req,res) {
    try{
        let data = await getBodyData(req);
        const { folder_name,user_id } = JSON.parse(data);
        const check = await fetch('INSERT INTO folder(folder_name,user_id) values($1,$2) returning id',folder_name,user_id);
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

async function deleteFolder(req,res) {
    try{
        const id = req.url.split("/")[2];
        const deletedFolder = await fetch('DELETE FROM folder WHERE id=$1 returning folder_name',id);
        res.writeHead(202,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"Successfully deleted",
            deletedFolder
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        console.error(e)
        basicErrorhandler(res,`${e.message}`)
    }
}

async function updateFolder(req,res) {
    try {
        const id = req.url.split("/")[2];
        const body = await getBodyData(req);
        const { folder_name,user_id } = JSON.parse(body);
        const data = await fetch('UPDATE folder SET folder_name=$1,user_id=$2 WHERE id=$3 returning id,folder_name,user_id',folder_name,user_id,id);
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
    getFolder,
    getFolderById,
    createFolder,
    deleteFolder,
    updateFolder

}