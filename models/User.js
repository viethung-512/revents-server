const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true
    // default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true
    // default: Date.now(),
  },
});

module.exports = User = model('User', UserSchema);
