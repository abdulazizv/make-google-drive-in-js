function basicErrorhandler(res,message = "Internal server error") {
    res.writeHead(502,{
        "Content-type":"application/json"
    });
    const resp = {
        status:"Error",
        response:message
    }
    res.end(JSON.stringify(resp))
}

module.exports = basicErrorhandler;