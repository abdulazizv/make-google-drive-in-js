const {basicErrorhandler, notFoundResponse} = require("../shared/helpers");
const {fetch, fetchAll} = require("../database/connection");

async function getDrives(req,res) {
    try {
        const data = await fetchAll('SELECT * FROM drives JOIN "users" ON user_id = users.id JOIN "folder" ON folder_id = folder.id');
        if(data.length < 1) {
            notFoundResponse(res,'Drives not found,Database is empty')
        }
        res.writeHead(200,{
            'Content-type':'application/json utf-8'
        })
        const resp = {
            status:"OK",
            data
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        console.error(e);
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getDrivesById(req,res,driveId) {
    try {
        const data = await fetch('SELECT * FROM drives JOIN "users" ON user_id = users.id JOIN "folder" folder_id=folders.id WHERE drives.id = $1',driveId);
        if(!data) {
            notFoundResponse(res,'Not found drive with this id')
        }
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"OK",
            data:data
        }
        res.end(JSON.stringify(resp))
    } catch(e) {

    }
}

async function createDrive(req,res) {

}
module.exports = {
    getDrives,
    getDrivesById
}