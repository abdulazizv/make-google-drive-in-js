const { getUserById, getUsers} = require("../services/user.service")

async function userController(req,res) {
    if (req.method === "GET") {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === "/users") {
            await getUsers(req, res);
        } else if (pathname.startsWith("/users/")) {
            const userId = pathname.split("/")[2];
            await getUserById(req, res, userId);
        }
    } if(req.method === "POST") {

    }
}

module.exports = {
    userController
}