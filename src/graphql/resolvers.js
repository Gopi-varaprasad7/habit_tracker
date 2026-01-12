import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../auth/jwt.js';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) return null;
      return prisma.user.findUnique({
        where: { id: user.userId },
        include: { habits: true },
      });
    },

    habits: (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.habit.findMany({
        where: { userId: user.userId },
        include: { topics: true },
      });
    },
  },

  Mutation: {
    register: async (_, { email, password }) => {
      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, password: hashed },
      });

      return {
        token: generateToken(user),
        user,
      };
    },

    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');

      return {
        token: generateToken(user),
        user,
      };
    },

    createHabit: (_, args, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.habit.create({
        data: { ...args, userId: user.userId },
      });
    },

    addTopic: (_, { habitId, name }) => {
      return prisma.topic.create({
        data: { habitId, name },
      });
    },

    completeTopic: (_, { topicId }) => {
      return prisma.topic.update({
        where: { id: topicId },
        data: { completed: true },
      });
    },
  },
};
