const {getDrivesById,getDrives} =  require("../services/drives.service");


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
    }
}

module.exports = {
    drivesController
}