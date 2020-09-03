const Event = require('../../../models/Event');
const { ApolloError } = require('apollo-server');

module.exports = {
  getEvents: async (parent, args, context, info) => {
    const { page, offset, limit, userId, filterType, startDate } = args;
    const filterOptions = {};
    try {
      if (userId) {
        switch (filterType) {
          case 'EVENT_PASS':
            filterOptions.date = { $lte: new Date() };
            break;
          case 'EVENT_FUTURE':
            filterOptions.date = { $gte: new Date() };
            break;
          case 'EVENT_HOST':
            filterOptions.host = userId;
            break;
          default:
            filterOptions.date = { $lte: new Date() };
            break;
        }
      } else {
        switch (filterType) {
          case 'EVENT_HOST':
            filterOptions.host = userId;
            break;
          case 'EVENT_GOING':
            filterOptions.attendees = { $contains: userId };
            break;
          case 'EVENT_DATE':
            filterOptions.date = { $gte: startDate };
            break;
          default:
            break;
        }
      }

      const result = await Event.paginate(filterOptions, {
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
        page: page ? page : 0,
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
      });

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
