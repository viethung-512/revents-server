const { gql } = require('apollo-server');

module.exports = gql`
  type Photo {
    id: String!
    url: String!
  }
  type User {
    id: String!
    username: String!
    email: String!
    photoURL: String
    description: String
    photos: [Photo!]!
    followers: [User!]!
    followings: [User!]!
    followerCount: Int!
    followingCount: Int!
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
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String
  }
  type UploadedFile {
    url: String!
  }

  enum FilterEventsType {
    EVENT_PASS
    EVENT_FUTURE
    EVENT_HOST

    EVENT_GOING
    EVENT_DATE
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
    getEvents(
      page: Int
      offset: Int
      limit: Int
      userId: String
      filterType: FilterEventsType
      startDate: String
    ): [Event!]!
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
    uploadProfileImage(image: Upload!): User!
    setMainPhoto(photo: String!): User!
    deletePhoto(photo: String!): User!
    toggleFollowUser(userId: String!): User!

    singleUpload(file: Upload!): File!
    singleUploadStream(file: Upload!): File!

    createEvent(eventInput: EventInput!): Event!
    updateEvent(id: String!, eventInput: EventInput!): Event!
    toggleAttendEvent(eventId: String!, userId: String!): Event!
    toggleCancelEvent(id: String!): Event!
  }
`;
