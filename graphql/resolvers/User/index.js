module.exports = {
  followerCount: parent => {
    return parent.followers.length;
  },
  followingCount: parent => {
    return parent.followings.length;
  },
  createdAt: parent => {
    return parent.createdAt.toISOString();
  },
};
