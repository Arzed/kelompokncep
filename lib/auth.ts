import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import db from '@/lib/db';
import { PrismaClient } from "@prisma/client";
import { userAuthSchema } from "@/lib/validation/auth";
// import bcrypt from 'bcrypt'

export const Role = 
   "USER"
  ||"DEVELOPER"
  ||"ADMINISTRATOR"

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // session: {
    
  //   strategy: 'jwt'
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      };
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // error: "/"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const cred = await userAuthSchema.parseAsync(credentials);
        if (!cred.name || !cred.password) {
          throw new Error('Email/Kata sandi yang di masukkan tidak valid')
        }

        const user = await db.user.findUnique({
          where: { name: cred.name as string },
        });

        if (!user?.name || !user.password ) return null

        if (user.password !== cred.password ) return null

        return user
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  // debug: process.env.NODE_ENV === "development"
};

export default authOptions;