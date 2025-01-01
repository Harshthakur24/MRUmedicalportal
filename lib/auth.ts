import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const student = await prisma.student.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!student) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          student.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: student.id,
          email: student.email,
          name: student.name,
          role: student.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

// For JWT tokens (login)
export function generateJWTToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// For verification/reset tokens (email verification, password reset)
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
} 