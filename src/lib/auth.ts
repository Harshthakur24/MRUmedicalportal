import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      department?: string | null;
      rollNumber?: string | null;
      year?: string | null;
      school?: string | null;
    };
  }
  interface User {
    role: string;
    department?: string | null;
    rollNumber?: string | null;
    year?: string | null;
    school?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    department?: string | null;
    rollNumber?: string | null;
    year?: string | null;
    school?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Missing credentials");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
            include: {
              accounts: {
                where: {
                  provider: 'credentials'
                }
              }
            }
          });

          console.log("Found user:", user ? "yes" : "no");
          console.log("Has account:", user?.accounts[0] ? "yes" : "no");

          if (!user || !user.accounts[0]?.access_token) {
            console.log("Invalid credentials - user not found or no access token");
            throw new Error("Invalid credentials");
          }

          if (!user.emailVerified) {
            console.log("Email not verified");
            throw new Error("Please verify your email first");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.accounts[0].access_token
          );

          console.log("Password valid:", isPasswordValid ? "yes" : "no");

          if (!isPasswordValid) {
            console.log("Invalid credentials - password mismatch");
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            school: user.school,
            department: user.department,
            year: user.year,
            rollNumber: user.rollNumber,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.school = user.school;
        token.department = user.department;
        token.year = user.year;
        token.rollNumber = user.rollNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.school = token.school;
        session.user.department = token.department;
        session.user.year = token.year;
        session.user.rollNumber = token.rollNumber;
      }
      return session;
    },
  },
};

export const auth = () => getServerSession(authOptions);
