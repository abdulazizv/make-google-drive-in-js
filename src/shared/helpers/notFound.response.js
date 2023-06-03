function notFoundResponse(res,message = 'Not found') {
    res.writeHead(404,{
        'Content-type':'application/json'
    })
    const resp = {
        status:"NOT found",
        message
    }
    res.end(JSON.stringify(resp))
}

module.exports = notFoundResponse