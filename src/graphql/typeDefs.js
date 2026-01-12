import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    habits: [Habit!]
  }

  type Habit {
    id: ID!
    name: String!
    period: String!
    color: String!
    topics: [Topic!]
    createdAt: String!
  }

  type Topic {
    id: ID!
    name: String!
    completed: Boolean!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    habits: [Habit!]
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createHabit(name: String!, period: String!, color: String!): Habit
    addTopic(habitId: ID!, name: String!): Topic
    completeTopic(topicId: ID!): Topic
  }
`;
