const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: String!
    username: String!
    email: String!
    photoURL: String
    description: String
    followers: [User!]!
    followings: [User!]!
    createdAt: String!
    updatedAt: String!
    token: String
  }
  type Event {
    id: String!
    title: String!
    category: String!
    description: String!
    city: String!
    venue: String!
    date: String!
    host: User!
    isCancelled: Boolean!
    attendees: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  input EventInput {
    title: String!
    category: String!
    description: String!
    city: String!
    venue: String!
    date: String!
  }

  type Query {
    login(email: String!, password: String!): User!
    getUser(id: String!): User!
    getMe: User!
    getEvents(page: Int, limit: Int): [Event!]!
    getEvent(id: String!): Event!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    updateUser(username: String, description: String, password: String): User!
    createEvent(eventInput: EventInput!): Event!
    updateEvent(id: String!, eventInput: EventInput!): Event!
    toggleAttendEvent(eventId: String!, userId: String!): Event!
    toggleCancelEvent(id: String!): Event!
    toggleFollowUser(userId: String!): User!
  }
`;
