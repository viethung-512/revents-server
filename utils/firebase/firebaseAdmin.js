const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://re-vents-1cdef.firebaseio.com',
});

module.exports = admin;
