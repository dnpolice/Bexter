const S3 = require('aws-sdk/clients/s3');
require("dotenv").config()
const fs = require("fs");

const bucketName = process.env.S3_bucket_name;
const region = process.env.S3_bucket_region;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

//uploads a file to s3
const upload = async (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
};
//downloada file from s3
const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}


exports.upload = upload;
exports.getFileStream = getFileStream;