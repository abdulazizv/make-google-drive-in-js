

function notAuthorizedResponse(res) {
    res.writeHead(401,{
        'Content-type': 'application/json'
    })
    const resp = {
        status: "Not Authorized",
        message: 'У вас нет доступа'
    }
    res.end(JSON.stringify(resp))
}

module.exports = notAuthorizedResponse