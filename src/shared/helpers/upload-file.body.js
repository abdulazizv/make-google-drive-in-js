// const AWS = require("aws-sdk");
// const { v4 } = require("uuid");
// const multer = require("multer");
// const fs = require("fs");
//
// const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files
//
// async function uploadFileToS3(req, res) {
//     try {
//         // Multer middleware to handle file upload
//         upload.single("file")(req, res, (err) => {
//             if (err) {
//                 console.error("Error uploading file:", err);
//                 res.statusCode = 500;
//                 res.end("Failed to upload file");
//                 return;
//             }
//
//             const file = req.file;
//
//             AWS.config.update({
//                 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//                 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//                 region: process.env.AWS_REGION,
//             });
//
//
//             const s3 = new AWS.S3();
//
//             const fileName = v4();
//
//             const fileStream = fs.createReadStream(file.path);
//
//
//             const params = {
//                 Bucket: process.env.AWS_BUCKET_NAME,
//                 Key: fileName,
//                 Body: fileStream,
//             };
//
//             s3.upload(params, (err, data) => {
//                 if (err) {
//                     console.error("Error uploading file to AWS S3:", err);
//                     res.statusCode = 500;
//                     res.end("Failed to upload file to AWS S3");
//                 } else {
//                     return data;
//                     // console.log(data)
//                     // console.log("AWS S3 URL:", data.Location)
//
//                     // res.end(data.Location);
//                 }
//             });
//         });
//     } catch (error) {
//         console.error("Error uploading file:", error);
//         res.statusCode = 500;
//         res.end("Failed to upload file");
//     }
// }
//
// module.exports = uploadFileToS3;
//
//


const AWS = require("aws-sdk");
const { v4 } = require("uuid");
const fs = require("fs");

async function uploadFileToS3(req, res) {
    try {
        const file = req.body.file; // Faylni o'qib olamiz

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });

        const s3 = new AWS.S3();
        const fileName = v4();

        // Faylni o'qib olamiz
        const fileStream = fs.createReadStream(file.path);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Error uploading file to AWS S3:", err);
                res.statusCode = 500;
                res.end("Failed to upload file to AWS S3");
            } else {
                console.log("AWS S3 URL:", data.Location);
                res.statusCode = 200;
                res.end(data.Location);
            }
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.statusCode = 500;
        res.end("Failed to upload file");
    }
}

module.exports = uploadFileToS3;
