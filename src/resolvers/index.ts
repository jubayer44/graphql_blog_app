import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import { Secret } from "jsonwebtoken";

const prisma = new PrismaClient();

interface ICreateUser {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    me: async (parent: any, args: any, context: any) => {
      return context.user;
    },
  },
  Mutation: {
    signup: async (parent: any, args: ICreateUser) => {
      const isExists = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if (isExists) {
        return {
          userError: "This email already exists",
          token: null,
        };
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);
      const user = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      if (args?.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: user.id,
          },
        });
      }

      const token = jwtHelpers.createToken(
        { userId: user?.id },
        config.jwt.secret as Secret
      );

      return {
        userError: null,
        token,
      };
    },

    signIn: async (
      parent: any,
      args: { email: string; password: string },
      context: any
    ) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (!user) {
        return {
          userError: "User not found",
          token: null,
        };
      }

      const isPasswordValid = await bcrypt.compare(
        args.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          userError: "Invalid password",
          token: null,
        };
      }

      const token = jwtHelpers.createToken(
        { userId: user?.id },
        config.jwt.secret as Secret
      );

      return {
        userError: null,
        token,
      };
    },
  },
};
