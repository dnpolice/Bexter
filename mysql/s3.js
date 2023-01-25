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
const upload = (file) => {
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

const getS3Object = (key) => {
    return s3.getObject({
        Bucket: bucketName,
        Key: key
    }).promise();
}

const getS3Objects = (keys) => {
    return Promise.all(keys.map(key =>
        s3.getObject({
            Bucket: bucketName,
            Key: key
        }).promise()
    
    ))
};


exports.upload = upload;
exports.getFileStream = getFileStream;
exports.getS3Object = getS3Object;
exports.getS3Objects = getS3Objects;

