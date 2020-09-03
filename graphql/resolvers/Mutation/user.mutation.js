const {
  UserInputError,
  ForbiddenError,
  ApolloError,
} = require('apollo-server');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../../../models/User');
const firebaseAdmin = require('../../../utils/firebase/firebaseAdmin');
const firebaseConfig = require('../../../utils/firebase/firebaseConfig');
const { registerValidator } = require('../../../utils/validators');
const {
  generateToken,
  getDownloadUrl,
  generateImageFilename,
} = require('../../../utils/helper');

module.exports = {
  register: async (parent, args, context, info) => {
    const { username, email, password } = args;

    try {
      // Validate input
      const { valid, errors } = registerValidator(args);
      if (!valid) {
        throw errors;
      }

      // Check username / email exists
      const usernameExists = await User.exists({ username });
      const emailExists = await User.exists({ email });

      if (usernameExists) errors.username = 'Username is already taken';
      if (emailExists) errors.email = 'Email is already taken';

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      // TODO: Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.save();
      const token = generateToken({ userId: user.id, username: user.username });

      user.token = token;

      return user;
    } catch (err) {
      console.log(err);
      throw new UserInputError('Bad Input', { errors: err });
    }
  },
  updateUser: async (
    parent,
    { username, description, password },
    { user: authUser },
    info
  ) => {
    const updateUserInfo = {};
    if (!authUser) {
      throw new ForbiddenError('You can not access this source.');
    }

    try {
      const user = await User.findById(authUser.userId);

      if (!user) {
        throw new ApolloError('User not found');
      }

      if (username) {
        if (username === authUser.username) {
          updateUserInfo.username = username;
        } else {
          const usernameExists = await User.exists({ username });
          if (usernameExists) {
            throw new ApolloError('User name already taken');
          }

          updateUserInfo.username = username;
        }
      }

      if (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        updateUserInfo.password = hashedPassword;
      }

      if (description) {
        updateUserInfo.description = description;
      }

      const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        updateUserInfo,
        { new: true }
      );

      return updatedUser;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('User not found');
      }

      throw err;
    }
  },
  toggleFollowUser: async (parent, { userId }, { user: authUser }, info) => {
    if (!authUser) {
      throw ForbiddenError('You can not access this source');
    }

    if (userId === authUser.id) {
      throw new ApolloError('You can not follow yourself');
    }

    try {
      const fromUser = await User.findById(authUser.userId);
      const toUser = await User.findById(userId);

      if (!fromUser || !toUser) {
        throw new ApolloError('User not found');
      }

      const updateFromUserInfo = {};
      const updateToUserInfo = {};

      const userFollowed = toUser.followers.some(
        fl => fl.toString() === fromUser.id.toString()
      );

      if (userFollowed) {
        updateFromUserInfo.followings = fromUser.followings.filter(
          fl => fl.toString() !== toUser.id.toString()
        );
        updateToUserInfo.followers = toUser.followers.filter(
          fl => fl.toString() !== fromUser.id.toString()
        );
      } else {
        updateFromUserInfo.followings = [...fromUser.followings, toUser.id];
        updateToUserInfo.followers = [...toUser.followers, fromUser.id];
      }

      await User.findByIdAndUpdate(fromUser.id, updateFromUserInfo, {
        new: true,
      });
      const updatedToUser = await User.findByIdAndUpdate(
        toUser.id,
        updateToUserInfo,
        { new: true }
      )
        .populate('followers', ['id', 'username', 'photoURL'], 'User')
        .populate('followings', ['id', 'username', 'photoURL'], 'User');

      return updatedToUser;
    } catch (err) {
      console.log(err);
      if (err.name === 'CastError') {
        throw new ApolloError('User not found');
      }
      throw err;
    }
  },
  uploadProfileImage: async (
    parent,
    { image },
    { user: authUser, req },
    info
  ) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    if (!image) {
      throw new ApolloError('Please choose image to upload');
    }

    const { createReadStream, filename, mimetype } = await image;
    const bucket = firebaseAdmin.storage().bucket(firebaseConfig.storageBucket);
    const uploadPath = `users/${authUser.userId}`;
    const imageFilename = generateImageFilename(filename);

    try {
      const user = await User.findById(authUser.userId);

      // upload image to firebase & getResponse URL
      await new Promise(res => {
        createReadStream()
          .pipe(
            bucket.file(`${uploadPath}/${imageFilename}`).createWriteStream({
              destination: `${uploadPath}/${imageFilename}`,
              resumable: false,
              gzip: true,
              metadata: {
                metadata: {
                  contentType: mimetype,
                  firebaseStorageDownloadTokens: uuidv4(),
                },
              },
            })
          )
          .on('finish', res);
      });
      const responseURL = getDownloadUrl(uploadPath, imageFilename);

      const updateUserInfo = {};

      if (!user.photoURL) {
        updateUserInfo.photoURL = responseURL;
      }

      updateUserInfo.photos = [
        ...user.photos,
        { url: responseURL, _id: uuidv4() },
      ];

      const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        updateUserInfo,
        { new: true }
      )
        .populate('host', ['id', 'username', 'photoURL'])
        .populate('attendees', ['id', 'username', 'photoURL']);

      return updatedUser;
    } catch (err) {
      throw err;
    }
  },
  setMainPhoto: async (parent, { photo }, { user: authUser }, info) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      const user = await User.findByIdAndUpdate(
        authUser.userId,
        { photoURL: photo },
        { new: true }
      );

      return user;
    } catch (err) {
      throw err;
    }
  },
  deletePhoto: async (parent, { photo }, { user: authUser }, info) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      const user = await User.findById(authUser.userId);

      const updateUserInfo = {
        photos: user.photos.filter(photoItem => photoItem.url !== photo),
      };

      const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        updateUserInfo,
        { new: true }
      );

      return updatedUser;
    } catch (err) {
      throw err;
    }
  },
};
