const {basicErrorhandler, notFoundResponse, getBodyData} = require("../shared/helpers");
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
      try {
          const body = await getBodyData(req)
          const {mimetype,originalName,is_openToAll,awslocation_id,folder_id} = JSON.parse(body);
          let newDrive;

          try {
              newDrive = await fetch('INSERT INTO drives(mimetype,originalName,is_openToAll,awslocation_id,folder_id,user_id) VALUES($1,$2,$3,$4,$5,$6) returning id,awslocation_id,user_id', mimetype, originalName, is_openToAll || false, awslocation_id, folder_id, req.user.id);
          } catch (e) {
              basicErrorhandler(res,`${e.message}`)
          }

          res.writeHead(201,{
              'Content-type':'application/json'
          })

          const resp = {
              status:"Created",
              data: newDrive
          }
          res.end(JSON.stringify(resp))
      } catch(e) {
          basicErrorhandler(res,`${e.message}`)
      }
}

async function updateDrive(req,res) {
    try {
        const id = req.url.split("/")[2]
        const body = await getBodyData(req)
        const {mimetype,originalName,is_openToAll,awslocation_id,folder_id} = JSON.parse(body);
        let updateDrive;

        try {
            updateDrive = await fetch('UPDATE drives SET mimetype=$1,originalName=$2,is_openToAll=$3,awslocation_id=$4,folder_id=$5,user_id=$6 WHERE id = $7 returning id,awslocation_id,originalName)', mimetype, originalName, is_openToAll || false, awslocation_id, folder_id, req.user.id,id);
        } catch (e) {
            basicErrorhandler(res,`${e.message}`)
        }

        res.writeHead(200,{
            'Content-type':'application/json'
        })

        const resp = {
            status:"Updated",
            data: updateDrive
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function deleteDrive(req,res) {
    try {
        const id = req.url.split("/")[2]
        let deletedId
        try {
            deletedId = await fetch('DELETE FROM drives WHERE id=$1 returning id',id)
        } catch (e) {
            basicErrorhandler(res,`${e.message}`)
        }

        const resp = {
            status:"Deleted",
            id: deletedId
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

module.exports = {
    getDrives,
    getDrivesById,
    createDrive,
    updateDrive,
    deleteDrive
}