import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          // Debug log
          console.log("Attempting login for email:", credentials.email);

          const student = await prisma.student.findUnique({
            where: { 
              email: credentials.email.toLowerCase() 
            },
          });

          // Debug log
          console.log("Found student:", student ? "Yes" : "No");

          if (!student) {
            console.log("No student found with this email");
            return null;
          }

          // Debug log
          console.log("Comparing passwords...");
          
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            student.password
          );

          // Debug log
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Password is invalid");
            return null;
          }

          // Debug log
          console.log("Login successful, returning user");

          return {
            id: student.id,
            email: student.email,
            name: student.name,
            role: student.role,
          };

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug mode
  secret: process.env.NEXTAUTH_SECRET,
}; 