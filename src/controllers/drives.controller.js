const {getDrivesById,getDrives, createDrive} =  require("../services/drives.service");
const checkTokenMiddleware = require("../shared/middlewares/check.token.middleware")

async function drivesController(req,res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === "/drives") {
            await getDrives(req, res);
        } else if (pathname.startsWith("/drives/")) {
            const driveId = pathname.split("/")[2];
            await getDrivesById(req, res, driveId);
        }
    } else if(req.method === "POST") {
            checkTokenMiddleware(req,res,async() => {
                await createDrive(req,res)
            })
    }
}

module.exports = {
    drivesController
}