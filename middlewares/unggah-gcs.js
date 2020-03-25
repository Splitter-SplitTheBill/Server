
const unggah = require('unggah')
const storage = unggah.gcs({
    keyFilename: 'middlewares/secret_keys/ocr-split-bill-5fd6255b2b6c-key.json',
    bucketName: 'split-bill-bucket',
    rename: (req, file) => {
      return `${Date.now()}-${file.originalname}`  // this is the default
    }
});

const upload = unggah({
    storage: storage // storage configuration for google cloud storage or S3
})
module.exports = upload



// function upload(filename) {
//     const bucketName = 'split-bill-bucket';
//     const {Storage} = require('@google-cloud/storage');
  
//     const storage = new Storage();
  
//     async function uploadFile() {
//       await storage.bucket(bucketName).upload(filename, {
//         gzip: false,
//         metadata: {
//           cacheControl: 'public, max-age=31536000',
//         },
//       });
  
//       console.log(`${filename} uploaded to ${bucketName}.`);
//     }
  
//     uploadFile()
//         .catch(console.error);
// }

// module.exports = upload;