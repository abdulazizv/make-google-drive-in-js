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

        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status:"Deleted",
            id: deletedId
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getAwsByLocationId(req,res) {
    try {
        const body = await getBodyData(req);
        const { awslocation_id } = JSON.parse(body);
        const data = await fetch('SELECT * FROM drives JOIN "users" user_id = users.id JOIN "folder" folder_id = folders.id WHERE awslocation_id = $1',awslocation_id);

        if  (!data) {
            notFoundResponse(res,'With awslocation_id such as file not found')
        }

        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status:"OK",
            data
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function findAllByUserId(req,res) {
    try {
        const body = await getBodyData(req);
        const { user_id } = JSON.parse(body)

        const data = await fetchAll('SELECT * FROM drives JOIN "folder" ON folder_id = folder.id WHERE drives.user_id = $1',user_id)
        if(!data) {
            notFoundResponse(res,'Files not found which belongs to this user')
        }

        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status: "OK",
            data
        }
        res.end(JSON.stringify(resp))
    } catch (e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function shareFileToAll(req,res) {
    try {
        const id = req.url.split("/")[2];
        const data = await fetch('UPDATE drives SET is_openToAll=$2 WHERE id = $1 returning *',id,true);
        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status: "Then this file open to everyone",
            data
        }
        res.end(JSON.stringify(resp))
    }  catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function shareFileWithEmail(req,res) {
    try {
        const body = await getBodyData(req)
        const { email,originalName,role_id } = JSON.parse(body);
        const data = await fetch('SELECT * FROM drives JOIN "users" user_id = users.id JOIN "folder" folder_id = folders.id WHERE awslocation_id = $1',originalName);

        if (!data) {
            notFoundResponse(res,'Files not found with this filename')
        }
        const sharedDrive = await fetch('INSERT INTO sharedDrive(drive_id,role_id,email) VALUES($1,$2,$3) returning *',data.id,role_id,email)

        res.writeHead(201,{
            'Content-type':'application/json'
        })
        const resp = {
            status:"Created",
            sharedDrive
        }
        res.end(JSON.stringify(resp))
    } catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getFilesByFolder(req,res) {
    try {
        const body = await getBodyData(req);
        const { folder_id } = JSON.parse(body);
        const data = await fetchAll('SELECT * FROM drives WHERE folder_id=$1',folder_id);

        if  (!data) {
            notFoundResponse(res,'Files not found with folder_id')
        }

        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status:"OK",
            data
        }
        res.end(JSON.stringify(data))
    } catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getFilesByMimeType(req,res) {
    try {
        const body = await getBodyData(req);
        const { mimetype } = JSON.parse(body);
        const data = await fetchAll('SELECT * FROM drives WHERE mimetype=$1',mimetype);

        if  (!data) {
            notFoundResponse(res,'Files not found with mimetype')
        }

        res.writeHead(200,{
            'Content-type': 'application/json'
        })

        const resp = {
            status:"OK",
            data
        }
        res.end(JSON.stringify(data))
    } catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }
}

async function getFilesSpecial() {
    try {
        const data = await fetchAll('SELECT * FROM drives JOIN "shareddrive" ON shareddrive.drive_id = drives.id')
        if(!data) {
            return false
        }
        return data
    } catch(e) {
        console.log(e)
        // basicErrorhandler(res,`${e.message}`)
    }
}
module.exports = {
    getDrives,
    getDrivesById,
    createDrive,
    updateDrive,
    deleteDrive,
    getAwsByLocationId,
    findAllByUserId,
    shareFileToAll,
    shareFileWithEmail,
    getFilesByFolder,
    getFilesByMimeType,
    getFilesSpecial
}