const { getFolder,getFolderById,createFolder,deleteFolder,updateFolder} = require("../services/folders.service")
async function folderController(req,res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === "/folder") {
            await getFolder(req, res);
        } else if (pathname.startsWith("/folder/")) {
            const folderId = pathname.split("/")[2];
            await getFolderById(req, res, folderId);
        }
    }
    else if(req.method === "POST") {
        await createFolder(req,res)
    }
    else if(req.method === "DELETE") {
        await deleteFolder(req,res)
    }
    else if(req.method === "PATCH") {
        await updateFolder(req,res)
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
    folderController
}