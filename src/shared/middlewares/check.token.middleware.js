const {notAuthorizedResponse, basicErrorhandler} = require("../helpers");
const {verifyAccessToken} = require("../auth/jwt.service");

function checkTokenMiddleware(req,res,next) {
    let token;
    try {
        const auth = req.headers.authorization;
        token = auth.split(" ")[1];
    } catch(e) {
            notAuthorizedResponse()
    }
    try {
        const data = verifyAccessToken(token)
        req.user = data
    } catch (e) {
        basicErrorhandler(res,`${e.message}`)
    }
    next()
}

module.exports = checkTokenMiddleware