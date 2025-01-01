import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const student = await prisma.student.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!student || !student?.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await compare(
          credentials.password,
          student.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Return the student object with necessary fields
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
    // Make sure session includes the student ID
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    // Include student ID in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 