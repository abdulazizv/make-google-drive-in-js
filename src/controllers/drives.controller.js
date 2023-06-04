const {getDrivesById,getDrives, createDrive, updateDrive, deleteDrive, getAwsByLocationId, findAllByUserId,
    shareFileToAll, shareFileWithEmail, getFilesByFolder, getFilesByMimeType
} =  require("../services/drives.service");
const checkTokenMiddleware = require("../shared/middlewares/check.token.middleware")
const accessGuardMiddleware = require("../shared/middlewares/access.guard")

async function drivesController(req,res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === "/drives") {
            accessGuardMiddleware(req,res,async() => {
                await getDrives(req,res)
            })
            // await getDrives(req, res);
        } else if (pathname.startsWith("/drives/")) {
            const driveId = pathname.split("/")[2];
            await getDrivesById(req, res, driveId);
        }
    } else if(req.url === "/drives/getawslocation/" && req.method === "GET") {
        await getAwsByLocationId(req,res)
    } else if(req.url === "/drives/by-user" && req.method === "GET") {
        await findAllByUserId(req,res)
    } else if(req.url === "/drives/share-all" && req.method === "PATCH") {
        await shareFileToAll(req,res)
    } else if(req.url === "/drives/share" && req.method === "POST") {
        await shareFileWithEmail(req,res)
    } else if(req.url === "/drives/by-folder" && req.method === "GET") {
        await getFilesByFolder(req,res)
    } else if(req.url === "drives/by-mimetype" && req.method === "GET") {
        await getFilesByMimeType(req,res)
    }

    else if(req.method === "POST") {
            checkTokenMiddleware(req,res,async() => {
                await createDrive(req,res)
            })
    } else if(req.method === "PATCH") {
        await updateDrive(req,res)
    } else if(req.method === "DELETE") {
        await deleteDrive(req,res)
    }
}

module.exports = {
    drivesController
}