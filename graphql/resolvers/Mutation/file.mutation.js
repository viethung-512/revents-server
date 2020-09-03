const fs = require('fs');
const path = require('path');

module.exports = {
  singleUpload: (parent, args) => {
    return args.file.then(file => {
      const { createReadStream, filename, mimetype } = file;

      const fileStream = createReadStream();

      fileStream.pipe(
        fs.createWriteStream(
          path.join(__dirname, '../../../uploadedFiles', filename)
        )
      );

      return file;
    });
  },
  singleUploadStream: async (parent, args) => {
    // const file = await args.file;
    // const { createReadStream, filename, mimetype } = file;
    // const fileStream = createReadStream();
    // //Here stream it to S3
    // // Enter your bucket name here next to "Bucket: "
    // const uploadParams = {
    //   Bucket: 'apollo-file-upload-test',
    //   Key: filename,
    //   Body: fileStream,
    // };
    // const result = await s3.upload(uploadParams).promise();
    // console.log(result);
    // return file;
  },
};
