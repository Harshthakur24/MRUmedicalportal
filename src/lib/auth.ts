import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

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
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        department?: string | null;
        rollNumber?: string | null;
        year?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase()
                    }
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (!user.emailVerified) {
                    throw new Error("Please verify your email before logging in");
                }

                // Get the password from Account table
                const account = await prisma.account.findFirst({
                    where: {
                        userId: user.id,
                        provider: 'credentials'
                    }
                });

                if (!account?.access_token) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await compare(credentials.password, account.access_token);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    department: user.department,
                    rollNumber: user.rollNumber,
                    year: user.year
                };
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.department = token.department;
                session.user.rollNumber = token.rollNumber;
                session.user.year = token.year;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = user as User;
                token.id = dbUser.id;
                token.role = dbUser.role;
                token.department = dbUser.department;
                token.rollNumber = dbUser.rollNumber;
                token.year = dbUser.year;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
};

export const auth = () => getServerSession(authOptions); 