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
exports.upload = (file) => {
    const fileStream = fs.createReadStream(file.path);

    let filename = file.filename;
    if (file.originalname.includes(".png") || file.originalname.includes(".mp3") || file.originalname.includes(".jpg")) {
        filename += file.originalname.slice(-4);
    } else if (file.originalname.includes(".jpeg")) {
        filename += file.originalname.slice(-5)
    }
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
        ContentType: file.mimetype
    }

    return s3.upload(uploadParams).promise()
};
//downloada file from s3
exports.getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}

exports.getS3Object = (key) => {
    return s3.getObject({
        Bucket: bucketName,
        Key: key
    }).promise();
}

exports.getS3Objects = (keys) => {
    return Promise.all(keys.map(key =>
        s3.getObject({
            Bucket: bucketName,
            Key: key
        }).promise()
    
    ))
};

exports.getS3Url = (key) => {
    return new Promise(function(resolve, reject) {
        s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: key
        }, function(err, url) { resolve(url); })
   })
}
