const { ForbiddenError, ApolloError } = require('apollo-server');
const Event = require('../../../models/Event');
const User = require('../../../models/User');

module.exports = {
  createEvent: async (parent, { eventInput }, { user: authUser }, info) => {
    const { title, category, description, city, venue, date } = eventInput;

    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      let newEvent = new Event({
        title,
        category,
        description,
        city,
        venue,
        date,
        host: authUser.userId,
        attendees: [authUser.userId],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newEvent.save();

      newEvent = await Event.findById(newEvent.id)
        .populate('host', ['id', 'username', 'photoURL'], 'User')
        .populate('attendees', ['id', 'username', 'photoURL'], 'User');

      return newEvent;
    } catch (err) {
      throw err;
    }
  },
  updateEvent: async (parent, { id, eventInput }, { user: authUser }, info) => {
    if (!authUser) {
      throw ForbiddenError('You can not access this source.');
    }

    try {
      let eventExists = await Event.exists({ _id: id });

      if (!eventExists) {
        throw new ApolloError('Event not found');
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, eventInput, {
        new: true,
      })
        .populate('host', ['id', 'username', 'photoURL'], 'User')
        .populate('attendees', ['id', 'username', 'photoURL'], 'User');

      return updatedEvent;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('Event not found');
      }
    }
  },
  toggleAttendEvent: async (
    parent,
    { eventId, userId },
    { user: authUser },
    info
  ) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source.');
    }

    try {
      const event = await Event.findById(eventId);

      if (!event) {
        throw new ApolloError('Event not found');
      }

      const userExists = await User.exists({ _id: userId });

      if (!userExists) {
        throw ApolloError('User not found');
      }

      const userJoined = event.attendees.some(att => att.equals(userId));

      if (userJoined) {
        event.attendees = event.attendees.filter(
          att => att.toString() !== userId
        );
      } else {
        event.attendees.push(userId);
      }

      const updatedEvent = await Event.findByIdAndUpdate(eventId, event, {
        new: true,
      })
        .populate('host', ['id', 'username', 'photoURL', 'User'])
        .populate('attendees', ['id', 'username', 'photoURL', 'User']);

      return updatedEvent;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('Not found');
      }
      console.log(err);
      throw err;
    }
  },
  toggleCancelEvent: async (parent, { id }, { user: authUser }, info) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      const event = await Event.findById(id);

      if (!event) {
        throw new ApolloError('Event not found');
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          isCancelled: !event.isCancelled,
        },
        { new: true }
      )
        .populate('host', ['id', 'username', 'photoURL', 'User'])
        .populate('attendees', ['id', 'username', 'photoURL', 'User']);

      return updatedEvent;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('Not found');
      }
      throw err;
    }
  },
};
