const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: String!
    username: String!
    email: String!
    imageUrl: String
    createdAt: String
    updatedAt: String
    token: String
  }
  type Message {
    id: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getUsers: [User!]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message!]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!

    sendMessage(to: String!, content: String!): Message!
  }
`;
