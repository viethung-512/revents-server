module.exports = {
  createdAt: (parent, args, context, info) => {
    return parent.createdAt.toISOString();
  },
  updatedAt: (parent, args, context, info) => {
    return parent.updatedAt.toISOString();
  },
};
