const Event = require('../../../models/Event');
const { ApolloError } = require('apollo-server');

module.exports = {
  getEvents: async (parent, args, context, info) => {
    try {
      const result = await Event.paginate(
        {},
        {
          populate: [
            {
              model: 'User',
              select: ['id', 'username', 'photoURL'],
              path: 'host',
            },
            {
              model: 'User',
              select: ['id', 'username', 'photoURL'],
              path: 'attendees',
            },
          ],
          page: args.page ? args.page : 1,
          limit: args.limit ? args.limit : 10,
        }
      );

      const events = result.docs;

      return events;
    } catch (err) {
      throw err;
    }
  },
  getEvent: async (parent, { id }, context, info) => {
    try {
      const eventExists = await Event.exists({ _id: id });

      if (!eventExists) {
        throw new ApolloError('Event not found');
      }

      const event = await Event.findById(id)
        .populate('host', ['id', 'username', 'photoURL'], 'User')
        .populate('attendees', ['id', 'username', 'photoURL'], 'User');

      return event;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('Event not found');
      }

      throw err;
    }
  },
};
