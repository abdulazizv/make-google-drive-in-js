const basicErrorhandler = require('./basicErrorhandler');
const getBodyData = require('./getBodyData');
const notFoundResponse = require('./notFound.response');
const uploadFileToS3 = require('./upload-file.body')

module.exports = {
    basicErrorhandler,
    notFoundResponse,
    getBodyData,
    uploadFileToS3
}