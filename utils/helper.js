const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const firebaseConfig = require('./firebase/firebaseConfig');

module.exports = {
  isEmpty: string => string.trim() === '',
  isValidEmail: email => {
    const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return regEx.test(email);
  },
  isValidPhone: phone => {
    const regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    return regEx.test(phone);
  },
  generateToken: data => {
    const jwtSecret = process.env.jwtSecret;
    return jwt.sign(data, jwtSecret, { expiresIn: '1h' });
  },
  generateImageFilename: filename => {
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    const imageFileName = `${shortid.generate()}.${imageExtension}`;

    return imageFileName;
  },
  getDownloadUrl: (path, imageFilename) => {
    const folder = path.replace('/', '%2F');
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${folder}%2F${imageFilename}?alt=media`;

    return downloadUrl;
  },
};
