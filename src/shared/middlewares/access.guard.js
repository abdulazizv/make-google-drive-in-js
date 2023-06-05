const {notAuthorizedResponse, basicErrorhandler} = require("../helpers");
const {verifyAccessToken} = require("../auth/jwt.service");
const {getFilesSpecial} = require("../../services/drives.service");

function accessGuardMiddleware(req,res,next) {
    let token;
    try {
        const auth = req.headers.authorization;
        token = auth.split(" ")[1]
    } catch(e) {
        notAuthorizedResponse(res)
    }
    let data;
    try {
        data = verifyAccessToken(token)
    } catch(e) {
        basicErrorhandler(res,`${e.message}`)
    }


    const drives = new Promise((resolve,reject) => {
        getFilesSpecial()
            .then((response) => resolve(response))
            .catch((error) => reject(error))
    })
    drives.then((result) => {
            if(result[0].is_opentoall || result[0].user_id == data.id) {
                return next()
            }
            let isOpen = true;
            for(let x of result) {
                if(x.email === data.email){
                    isOpen = false
                }
            }
            if(!isOpen){
                return next()
            } else {
                notAuthorizedResponse(res)
            }

    }).catch((error) => {
        basicErrorhandler(res,`${error.message}`)
    })
    next()
}

module.exports = accessGuardMiddleware