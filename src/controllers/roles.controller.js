// const { getUserById, getUsers, createUsers,deleteUser, updateUser, signIn} = require("../services/user.service")
//
// async function userController(req,res) {
//     if (req.method === "GET") {
//         const url = new URL(req.url, `http://${req.headers.host}`);
//         const pathname = url.pathname;
//
//         if (pathname === "/users") {
//             await getUsers(req, res);
//         } else if (pathname.startsWith("/users/")) {
//             const userId = pathname.split("/")[2];
//             await getUserById(req, res, userId);
//         }
//     }
//     else if(req.url === "/users/signin" && req.method === "POST") {
//         await signIn(req,res)
//     }
//     else if(req.method === "POST") {
//         await createUsers(req,res)
//     }
//     else if(req.method === "DELETE") {
//         await deleteUser(req,res)
//     }
//     else if(req.method === "PATCH") {
//         await updateUser(req,res)
//     }
// }
//
// module.exports = {
//     userController
// }