const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isCancelled: {
    type: Boolean,
    required: true,
    default: false,
  },
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

EventSchema.plugin(mongoosePaginate);

module.exports = Event = model('Event', EventSchema);
