const {notAuthorizedResponse, basicErrorhandler} = require("../helpers");
const {verifyAccessToken} = require("../auth/jwt.service");
const {getFilesSpecial} = require("../../services/drives.service");

function accessGuardMiddleware(req,res,next) {
    let token;
    try {
        const auth = req.headers.authorization;
        token = auth.split("/")[2]
    } catch(e) {
        notAuthorizedResponse(res)
    }
    // let drives;
    const drives = new Promise((resolve,reject) => {
        getFilesSpecial()
            .then((response) => resolve(response))
            .catch((error) => reject(error))
    })
    console.log(drives);

    next()
}

module.exports = accessGuardMiddleware