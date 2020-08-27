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
  photoURL: {
    type: String,
  },
  description: {
    type: String,
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  followings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    // default: Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    // default: Date.now(),
  },
});

module.exports = User = model('User', UserSchema);
