const unggah = require('unggah')
const storage = unggah.s3({
    endpoint: 's3.ap-southeast-1.amazonaws.com',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: 'jsprojectdev37',
    // rename: (req, file) => {
    //   return `${Date.now()}-${file.originalname}`  // this is the default
    // }
})
const upload = unggah({
    storage: storage // storage configuration for google cloud storage or S3
})
module.exports = upload